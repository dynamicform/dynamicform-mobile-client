/**
 * Created by XiongXiang on 2017/8/23.
 */
import React from 'react';
import {DatePicker, List} from 'antd-mobile';
import {connect} from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {initDynamicFormData, initFormData, updateDynamicFormData, updateFormData} from '../../actions/formAction';
import {getIsCascadeElement, IsNullorUndefined, MapStateToProps} from '../../utility/common';
import _ from 'lodash';
import {rangePickerPropType} from '../../utility/propTypes';

export class QRangePicker extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            ...props.definition
        };
    }

    componentWillMount() {
        if (this.getValue(this.props.formData)) {
            this.state.defaultvalue.starttime = moment(this.getValue(this.props.formData)[0], this.state.format);
            this.state.defaultvalue.endtime = moment(this.getValue(this.props.formData)[1], this.state.format);
        } else {
            if (this.props.definition.defaultvalue) {
                if (this.state.defaultvalue.starttime) {
                    this.state.defaultvalue.starttime = moment(this.state.defaultvalue.starttime, this.state.format);
                }
                if (this.state.defaultvalue.endtime) {
                    this.state.defaultvalue.endtime = moment(this.state.defaultvalue.endtime, this.state.format);
                }
            } else {
                this.state.defaultvalue = null;
            }
        }

        if (this.props.isNewForm) {
            const value = this.getValue(this.props.formData);
            if (this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
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
        if (this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const index = dataPosition.index;
            return `${this.objectKey}-${index}`;
        } else {
            return this.objectKey;
        }
    }

    getRules() {
        if (this.getHidden() === 'none' || this.getDisabled()) {
            return [];
        } else {
            return this.state.rules;
        }
    }

    getHidden() {
        if (!this.state.conditionMap || this.state.conditionMap.length == 0) {
            return this.state.hidden ? 'none' : '';
        } else {
            let ElementAttribute = this.state.conditionMap.map((item, index) => {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'hidden' && item.actionValue ? 'none' : '';
                    }
                }
                return '';
            });
            return _.includes(ElementAttribute, 'none') ? 'none' : '';
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

    handleOnChangeStarttime(date) {
        const value = date;
        if (!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
            this.state.defaultvalue.starttime = moment(value, IsNullorUndefined(this.state.format) ? 'YYYY-MM' : this.state.format);
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    handleOnChangeEndtime(date) {
        const value = date;
        if (!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
            this.state.defaultvalue.endtime = moment(value, IsNullorUndefined(this.state.format) ? 'YYYY-MM' : this.state.format);
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement = getIsCascadeElement(nextProps.formData, this.props.formData, this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }

    // 日期格式化
    formatDate(date) {
        return date.format(this.state.format);
    }

    render() {
        if (!this.isHidden) {
            return (<List>
                <DatePicker
                    mode="date"
                    title={this.state.placeholder}
                    value={this.state.defaultvalue.starttime}
                    disabled={this.getDisabled()}
                    format={(date) => this.formatDate(date)}
                    onChange={(date) => this.handleOnChangeStarttime(date)}>
                    <List.Item arrow="horizontal">{this.state.label}</List.Item>
                </DatePicker>
                <DatePicker
                    mode="date"
                    title={this.state.placeholder}
                    value={this.state.defaultvalue.endtime}
                    disabled={this.getDisabled()}
                    format={(date) => this.formatDate(date)}
                    onChange={(date) => this.handleOnChangeEndtime(date)}>
                    <List.Item arrow="horizontal">{this.state.label}</List.Item>
                </DatePicker>
            </List>);
        } else {
            return (<List></List>);
        }
    }
}

QRangePicker.propTypes = rangePickerPropType;
export default connect(MapStateToProps)(QRangePicker);

