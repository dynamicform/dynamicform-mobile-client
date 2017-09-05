import React from 'react';
import {connect} from 'react-redux';
import {InputItem, List} from 'antd-mobile';
import {FormItemLayout,getIsCascadeElement,MapStateToProps} from '../../utility/common';
import {initFormData,initDynamicFormData, updateFormData, updateDynamicFormData} from '../../actions/formAction';
import _ from 'lodash';

export class QTextField extends React.Component{
    constructor(props){
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            ...props.definition
        };
    }
    componentWillMount(){
        if(this.props.isNewForm) {
            const value = this.props.definition.defaultvalue ? this.props.definition.defaultvalue : '';
            if(this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        const isCascadElement = getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }
    handleOnChange(value) {
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
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
        const {getFieldDecorator,getFieldError } =this.props.form;
        return(
            <List>
                { this.isHidden ? null: getFieldDecorator(this.DynamicKey,{
                    rules:this.Rules,
                    initialValue:value
                })(
                    <InputItem
                        extra={this.state.extra}
                        type={this.state.inputType}
                        placeholder={this.state.placeholder}
                        error={getFieldError(this.DynamicKey) ? true : false}
                        editable={this.state.disabled}  // 这个属性在build中赋值是反的.
                        onChange={this.handleOnChange}
                    >{this.state.label}</InputItem>
                )}
                {/*{(errors = getFieldError(this.DynamicKey)) ? errors.join(',') : null}*/}
            </List>
        );
    }
}
export default connect(MapStateToProps)(QTextField);