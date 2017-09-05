/**
 * Created by KangYe on 2017/8/17.
 */
import PropTypes from 'prop-types';
const {any, bool, func, shape, string, object, number, array} = PropTypes;

export const cascadePickerPropTypes = {
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        conditionMap:array.isRequired,
    })
};
export const selectPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        optionDataKey:string.isRequierd,
        rules: array.isRequired
    })
};
export const datePickerPropType = {
    definition: shape({
        name: string.isRequierd,
        path: string.isRequierd,
        label: string.isRequierd,
        rules: array.isRequired,
        format: string.isRequired
    })
};
export const monthPickerPropType = {
    definition: shape({
        name: string.isRequierd,
        path: string.isRequierd,
        label: string.isRequierd,
        rules: array.isRequired,
        format: string.isRequired
    })
};
export const timePickerPropType = {
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        format: string.isRequired
    })
};
export const rangePickerPropType = {
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        format: string.isRequired
    })
};
export const checkBoxGroupPropType={
    definition:shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        optionDataKey: string.isRequired,
        rules: array.isRequired
    })
};

