const validate = (props, payload) => {
    if (!(props instanceof Array))
        throw new Error("Required props must be an array of fields");
    else if (props.length < 1) return true;
    else if (!payload) return false;
    else if (payload.constructor !== Object) return false;
    else if (Object.keys(payload).length < 1) return false;

    const found = props.filter(each => payload[each]);
    return found.length === props.length;
};

export default { validate };
