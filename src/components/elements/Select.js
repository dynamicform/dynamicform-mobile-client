import React from 'react';
import {connect} from 'react-redux';
import {initDynamicFormData, initFormData, updateDynamicFormData, updateFormData} from '../../actions/formAction';
import {getIsCascadeElement, MapStateToProps} from '../../utility/common';
import _ from 'lodash';
import {List, Picker} from 'antd-mobile';
import {selectPropType} from '../../utility/propTypes';

export class QSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.definition
        };
    }

    componentWillMount() {
        if (this.props.isNewForm) {
            const value = this.getValue(this.props.formData);
            if (this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
        const option = this.selectOptions;
        this.state.options.push(option);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        const isCascadElement = getIsCascadeElement(nextProps.formData, this.props.formData, this.state.conditionMap);
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }

    handleOnChange(event) {
        const value = event? event[0]:'';
        if (!this.props.isDynamic) {
            // 1.给目标控件赋值.
            this.props.dispatch(updateFormData(this.objectPath, value));
            // 2.联动下拉列表
            if (this.state.valueMap) {
                for (let item of this.state.options) {
                    if (item.value === value) {
                        for (let sourceKey in this.state.valueMap) {
                            this.props.dispatch(updateFormData(this.state.valueMap[sourceKey], item[sourceKey]));
                        }
                        break;
                    }
                }
            }
        } else {
            // 3.动态新增字段.
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    // 初始化下拉列表.
    get selectOptions() {
        if (this.props.formDictionary.data && this.state.optionDataKey) {
            const result = _.find(this.props.formDictionary.data, {'value': this.state.optionDataKey});
            return result.children;
        }
        return this.state.options;
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

    get objectPath() {
        return this.state.path || this.state.name;
    }

    get objectKey() {
        return this.state.name;
    }

    get DynamicKey() {
        if (this.props.isDynamic) {
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

    get isDisabled(){
        if(!this.state.conditionMap|| this.state.conditionMap.length == 0) {
            return this.state.disabled;
        }else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return itemValue && item.value === itemValue && item.action === 'disabled' && item.actionValue;
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

    get Rules(){
        //需要处理Hidden的处理this.isHidden==='none'||
        if(this.isDisabled){
            return [];
        }else{
            return this.state.rules;
        }
    }

    render() {
        const value=this.getValue(this.props.formData);
        const {getFieldDecorator} =this.props.form;
        return (
            <List>
                { this.isHidden ? null: getFieldDecorator(this.DynamicKey,{
                    rules:this.Rules,
                    initialValue:value
                })(
                <Picker
                    data={this.state.options}
                    title={this.state.label}
                    cascade={false}
                    disabled={this.isDisabled}
                    extra={this.state.addonBefore}
                    onChange={(event)=>this.handleOnChange(event)}>
                    <List.Item arrow='horizontal'>{this.state.label}</List.Item>
                </Picker>
            )}
            </List>
        );
    }

}
QSelect.propTypes = selectPropType;
export default connect(MapStateToProps)(QSelect);