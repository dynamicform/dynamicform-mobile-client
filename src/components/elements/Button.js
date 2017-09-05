import {View,Button,Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import React from 'react';
import {MapStateToProps,FormItemLayout} from '../../utility/common';
import _ from 'lodash';
import {submittingForm,setFormStatus,updateInitFormData} from '../../actions/formAction';
export class QButton extends React.Component{
    constructor(){
        super();
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    componentWillMount(){
        this.state = this.props.definition;
    }

    getDisabled(){
    }

    handleOnClick(){
        switch(this.state.buttonType){
            case 'save': {
                this.props.form.validateFields({force: true}, (error, values) => {
                    if (!error) {
                        const formData = this.props.formData;
                        this.props.dispatch(setFormStatus());
                        this.props.dispatch(submittingForm(formData, this.props, this.state.actionPath));
                    } else {
                        let message='';
                        for (let key in error) {
                            error[key].errors.map((item, index)=> {
                                message=message+item.message;
                            });
                        }
                        Toast.fail(message, 2);
                        this.props.dispatch(setFormStatus());
                    }
                });
                break;
            }
            case 'button':
                break;
            case 'custom': {
                if(this.state.onFunction) {
                    let fun=function(parameter){  return new Function(`return ${parameter}`)();};
                    fun(this.state.onFunction)();
                }
                break;
            }
            case 'validationButton':
                break;
            case 'reset': {
                this.props.dispatch(updateInitFormData());
                this.props.form.resetFields();
                break;
            }
        }
    }

    render() {
        return (
                <Button type="primary" htmlType={this.state.action} disabled={this.getDisabled()}
                        onClick={this.handleOnClick}>{this.state.label}
                </Button>
        );
    }
}
export default connect(MapStateToProps)(QButton);