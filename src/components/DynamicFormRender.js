import React from 'react';
import {ScrollView} from 'react-native'
import {View,List} from 'antd-mobile';
import {connect} from 'react-redux';
import {attachForm, createNewForm, loadFormData, loadFormDefinition} from '../actions/formAction';
import {getElement} from './factories/elementFactory';
import { createForm } from 'rc-form';
//import  createDOMForm  from 'rc-form/lib/createDOMForm';
import _ from 'lodash';

function mapStateToProps(store) {
    return {
        formDefinitionLoaded: store.formReducer.formDefinitionLoaded,
        formDataLoaded: store.formReducer.formDataLoaded,
        formDefinition: store.formReducer.formDefinition,
        formData: store.formReducer.formData,
        formLoadedComplete: store.formReducer.formLoadedComplete,
        formIsValid: store.formReducer.formIsValid,
        isNewForm: store.formReducer.isNewForm
    };
}
@createForm()
@connect(mapStateToProps)
class DynamicFormRender extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        const definitionSrc = this.props.formDefinitionSrc;
        const dataSrc = this.props.formDataSrc;
        const dictPath = this.props.dictpath;
        this.props.dispatch(loadFormDefinition(definitionSrc));
        this.props.dispatch(attachForm(this.props.form));
        if (dataSrc) {
            this.props.dispatch(loadFormData(dataSrc));
        } else {
            this.props.dispatch(createNewForm());
        }
    }

    getComponent(componentDefinition, index) {
        let value = '';
        // if the formData is not null means it is old form
        if (this.props.formDataSrc && this.props.formData) {
            value = componentDefinition.hasOwnProperty('path') ?
                _.get(this.props.formData, componentDefinition.path) : componentDefinition.hasOwnProperty('name') ?
                    _.get(this.props.formData, componentDefinition.name) : '';
        }
        return getElement(componentDefinition, index, value,this.props);
    }

    handleOnSubmit(event) {

    }

    render() {
        let renderForm;
        if (this.props.formLoadedComplete) {
            const componentDefinitions = this.props.formDefinition.components;
            renderForm = componentDefinitions.map((componentDefinition, index) => {
                return this.getComponent(componentDefinition, index);
            });
        } else {
            renderForm = <View/>;
        }
        return (
            <View>
                <ScrollView>
                    <List>
                        {renderForm}
                    </List>
                </ScrollView>

            </View>
        );
    }
}

export default DynamicFormRender;