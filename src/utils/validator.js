const validate = (props, payload) => {
    const found = props.filter(each => payload[each]);
    return found.length === props.length;
};

export default { validate };
