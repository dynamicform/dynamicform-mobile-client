import React from 'react';
import Button from '../elements/Button';
import {View} from 'antd-mobile';
import InputItem from '../elements/InputItem';
import Container from '../elements/Container';
import Radio from '../elements/RadioGroup';
import CascadePicker from '../elements/CascadePicker';
import Select from '../elements/Select';
import DatePicker from '../elements/DatePicker';
import MonthPicker from '../elements/MonthPicker';
import TimePicker from '../elements/TimePicker';
import RangePicker from '../elements/RangePicker';
import CheckBoxGroup from '../elements/CheckBoxGroup';
import Switch from '../elements/Switch';


export function getDynamicElement(componentDefinition, index, dataPosition) {
    const componentType = componentDefinition.type;
    switch (componentType){
        case 'button':
            return <Button
                key={index}
                definition={componentDefinition}
                isDynamic="true"
                dataPosition={dataPosition}
            />;
        default:
            return '';
    }
}

export function getElement(componentDefinition, index, value,props){
    const componentType = componentDefinition.type;
    switch (componentType){
        case 'button':
            return <Button key={index} definition={componentDefinition} value={value} {...props}/>;
        case 'textfield':
            return <InputItem key={index} definition={componentDefinition}/>;
        case 'container':
            return <Container key={index} definition={componentDefinition} value={value}/>;
        case 'radioGroup':
            return <Radio key={index} definition={componentDefinition}/>;
        case 'cascadeSelect':
            return <CascadePicker key={index} definition={componentDefinition}/>;
        case 'select':
            return <Select key={index} definition={componentDefinition}/>;
        case 'datepicker':
            return <DatePicker key={index} definition={componentDefinition}/>;
        case 'monthpicker':
            return <MonthPicker key={index} definition={componentDefinition} />;
        case 'timepicker':
            return <TimePicker key={index} definition={componentDefinition}/>;
        case 'rangepicker':
            return <RangePicker key={index} definition={componentDefinition}/>;
        case 'checkBoxGroup':
            return <CheckBoxGroup key={index} definition={componentDefinition}/>;
        case 'switch':
            return <Switch key={index} definition={componentDefinition} />;
        default:
            return <View key={index}/>;
    }
}