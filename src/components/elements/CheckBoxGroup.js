/**
 * Created by XiongXiang on 2017/8/24.
 */
import React from 'react';
import {connect} from 'react-redux';
import {initDynamicFormData, initFormData, updateDynamicFormData, updateFormData} from '../../actions/formAction';
import {Checkbox, List} from 'antd-mobile';
import _ from 'lodash';
import {checkBoxGroupPropType} from '../../utility/propTypes';
import {getIsCascadeElement, MapStateToProps} from '../../utility/common';
const CheckboxItem = Checkbox.CheckboxItem;

export class QCheckBoxGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.definition
        };
    }

    componentWillMount() {
        const result = _.find(this.props.formDictionary.data, {'value': this.state.optionDataKey});
        if (!_.isUndefined(result)) {
            this.setState({
                options: result.children
            });
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

    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        return this.state.path || this.state.name;
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

    shouldComponentUpdate(nextProps, nextState) {
        // only render when value is changed or form is submitting
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement = getIsCascadeElement(nextProps.formData, this.props.formData, this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }

    handleOnChange = (val) => {
        const value = val;
        if (!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    render() {
        const data = [];
        this.state.options.map((option, index) => {
            data.push({label: option[this.state.textField], value: option[this.state.valueField]});
        });
        const defaultValue = this.state.defaultvalue;
        if (!this.isHidden) {
            return (<List>
                {data.map(i => {
                    let mainObject = this;
                    function nomalDisableCheckBox() {
                        return <CheckboxItem key={i.value} disabled onChange={() => mainObject.handleOnChange(i.value)}>
                            {i.label}
                        </CheckboxItem>;
                    }

                    function nomalCheckBox() {
                        return <CheckboxItem key={i.value} onChange={() => mainObject.handleOnChange(i.value)}>
                            {i.label}
                        </CheckboxItem>;
                    }

                    function setDefaultDisableCheckBox() {
                        return <CheckboxItem key={i.value} defaultChecked disabled
                                             onChange={() => mainObject.handleOnChange(i.value)}>
                            {i.label}
                        </CheckboxItem>;
                    }

                    function setDefaultCheckBox() {
                        return <CheckboxItem key={i.value} defaultChecked onChange={() => mainObject.handleOnChange(i.value)}>
                            {i.label}
                        </CheckboxItem>;
                    }
                    if (i.value == defaultValue) {
                        return this.getDisabled() ? setDefaultDisableCheckBox():setDefaultCheckBox();
                    } else {
                        return this.getDisabled() ? nomalDisableCheckBox():nomalCheckBox();
                    }
                })}
            </List>);
        } else {
            return (<List></List>);
        }
    }
}
QCheckBoxGroup.propTypes = checkBoxGroupPropType;
export default connect(MapStateToProps)(QCheckBoxGroup);
