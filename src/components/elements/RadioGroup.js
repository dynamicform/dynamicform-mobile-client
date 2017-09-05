import React from 'react';
import {connect} from 'react-redux';
import {initDynamicFormData, initFormData, updateDynamicFormData, updateFormData} from '../../actions/formAction';
import {MapStateToProps,getIsCascadeElement} from '../../utility/common';
import { List, Radio, Flex,WhiteSpace,Card } from 'antd-mobile';
import _ from 'lodash';
const RadioItem = Radio.RadioItem;
const ListItem=List.Item;


export class QRadioGroup extends React.Component {
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
        this.state.options=option;
    }
    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        const isCascadElement = getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }

    get selectOptions() {
        if (this.props.formDictionary.data && this.state.optionDataKey) {
            const result = _.find(this.props.formDictionary.data, {'value': this.state.optionDataKey});
            return result.children;
        }
        return this.state.options;
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

    getValue(formData) {
        if (this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const path = `${dataPosition.objectName}[${dataPosition.index}].${this.objectPath}`;
            return _.get(formData, path);
        } else {
            return _.get(formData, this.objectPath);
        }
    }
    handleOnChange = (value) => {
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }
    render() {
        const value = this.getValue(this.props.formData);
        const {getFieldDecorator} =this.props.form;

        if (!this.isHidden) {
            return (
                <List renderHeader={() =>this.state.label}>
                    {getFieldDecorator(this.DynamicKey, {rules: this.Rules})(
                        <ListItem>
                            {this.state.options.map(i => (
                                <RadioItem key={i.value} checked={value === i.value}
                                           onChange={() => this.handleOnChange(i.value)}>
                                    {i.label}
                                </RadioItem>
                            ))}
                        </ListItem>
                    )}
                </List>
            );
        } else {
            return (
                <List></List>
            );
        }
    }
}
export default connect(MapStateToProps)(QRadioGroup);