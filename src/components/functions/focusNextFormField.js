const focusNextFormField = e => {
    const form = e.target.form;
    const formIndex = [...form].indexOf(e.target);
    return form.elements[formIndex + 1].focus();
}
 
export default focusNextFormField