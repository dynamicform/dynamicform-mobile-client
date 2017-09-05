/**
 * Created by XiongXiang on 2017/8/22.
 */
import React from 'react';
import {DatePicker, List} from 'antd-mobile';
import {connect} from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {initFormData,initDynamicFormData, updateFormData, updateDynamicFormData} from '../../actions/formAction';
import {getIsCascadeElement, IsNullorUndefined, MapStateToProps} from '../../utility/common';
import _ from 'lodash';
import {datePickerPropType} from '../../utility/propTypes';

export class QDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.definition,
        };
    }

    componentWillMount() {
        if (this.getValue(this.props.formData)) {
             this.state.defaultvalue = moment(this.getValue(this.props.formData), IsNullorUndefined(this.state.format) ? 'YYYY-MM-DD kk:mm:ss' : this.state.format);
        } else {
            if (this.props.definition.defaultvalue) {
                 this.state.defaultvalue = moment(this.props.definition.defaultvalue, IsNullorUndefined(this.state.format) ? 'YYYY-MM-DD kk:mm:ss' : this.state.format);
            } else {
                this.state.defaultvalue = null;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement = getIsCascadeElement(nextProps.formData, this.props.formData, this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }

    getValue(formData) {
        if (this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const path = `${dataPosition.objectName}[${dataPosition.index}].${this.objectPath}`;
            return _.get(formData, path);
        } else {
            return _.get(formData, this.objectPath);
        }
    }

    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        return this.state.path || this.state.name;
    }

    getDynamicKey() {
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const index = dataPosition.index;
            return `${this.objectKey}-${index}`;
        } else {
            return this.objectKey;
        }
    }

    get isHidden() {
        if (!this.state.conditionMap  || this.state.conditionMap.length == 0) {
            return this.state.hidden;
        } else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'hidden' && item.actionValue;
                    }
                }
            });
            return _.includes(ElementAttribute, true);
        }
    }

    // 日期格式化
    formatDate(date) {
        return date.format(this.state.format);
    }

    // 确定选择日期
    handleOnChange(date) {
        const value = date;
        if (!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
            this.state.defaultvalue = moment(value, IsNullorUndefined(this.state.format) ? 'YYYY-MM-DD kk:mm:ss' : this.state.format);
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    getDisabled() {
        if (!this.state.conditionMap || this.state.conditionMap.length == 0) {
            return this.state.disabled;
        } else {
            let ElementAttribute = this.state.conditionMap.map((item, index) => {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'disabled' && item.actionValue;
                    }
                    case 'greater': {
                        return '';
                    }
                    case 'less': {
                        return '';
                    }
                }
            });
            return _.includes(ElementAttribute, true);
        }
    }

    render() {
        if (!this.isHidden){
            return (<List>
                <DatePicker
                    mode="date"
                    title={this.state.placeholder}
                    // extra={this.state.placeholder}   // extra 属性应用在List.Item 上.
                    value={this.state.defaultvalue}
                    disabled={this.getDisabled()}
                    format={(date) => this.formatDate(date)}
                    onChange={(date) => this.handleOnChange(date)}>
                    <List.Item arrow="horizontal">{this.state.label}</List.Item>
                </DatePicker>
            </List>);
        } else {
            return (<List></List>);
        }
    }
}
QDatePicker.propTypes = datePickerPropType;
export default connect(MapStateToProps)(QDatePicker);