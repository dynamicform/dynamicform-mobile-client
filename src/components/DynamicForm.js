/**
 * Created by V-XiongXiang on 2017/8/4.
 */
import React from 'react';
import DynamicFormRender from './DynamicFormRender';

class DynamicForm extends React.Component{
    constructor(){
        super();
    }
    render(){
        return(
            <DynamicFormRender {...this.props} />
        );
    }
}

export default DynamicForm;