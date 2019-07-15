import React, { Component } from 'react';
import './styles/styles.scss';

let ref;

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: props.fields,
      cols: props.cols,
      className: props.className,
      title: props.title,
      hash: this.generateHash(),
      values: {},
      loading: false
    };
    this.submit = this.submit.bind(this);
    this.switcher = this.switcher.bind(this);
    this.hash = this.generateHash();
  }

  componentWillReceiveProps(props) {
    this.setState({
      fields: props.fields,
      cols: props.cols,
      className: props.className,
      title: props.title
    });
  }

  componentWillMount() {
    let { fields, values } = this.state;
    fields &&
      fields.map((item, index) => {
        if (item.name) values[item.name] = this.getDefaultValue(item);
      });
    this.setState({
      values
    });
  }

  onDragListener(e) {
    let fileWrapper = e.target.closest('.form-control-wrapper');
    if (fileWrapper) fileWrapper.classList.add('drag-over');
  }

  offDragListener(e) {
    let fileWrapper = e.target.closest('.form-control-wrapper');
    if (fileWrapper) fileWrapper.classList.remove('drag-over');
  }

  componentDidMount() {
    let files = ref ? ref.querySelectorAll('input[type="file"]') : [];
    files.forEach((file, index) => {
      file.addEventListener('dragenter', this.onDragListener);
      file.addEventListener('dragover', this.onDragListener);
      file.addEventListener('dragleave', this.offDragListener);
      file.addEventListener('drop', this.offDragListener);
    });
  }

  componentWillUnmount() {
    let files = ref ? ref.querySelectorAll('input[type="file"]') : [];
    files.forEach((file, index) => {
      file.removeEventListener('dragenter', this.onDragListener);
      file.removeEventListener('dragover', this.onDragListener);
      file.removeEventListener('dragleave', this.offDragListener);
      file.removeEventListener('drop', this.offDragListener);
    });
  }

  generateHash() {
    let rand = window.Math.floor(window.Math.random() * 0x10000000000000),
      result;
    (rand = rand.toString(16).substring(1)),
      (result = rand
        .split('')
        .splice(0, 10)
        .join(''));
    return result;
  }

  removeError(item) {
    let { fields } = this.state,
      index = fields.findIndex((field, index) => {
        return field.name === item.name;
      });
    fields[index].error = '';
    this.setState({
      fields
    });
  }

  inputChange(item, event) {
    let { values } = this.state,
      { value } = event.target;
    if (item.beforeChange && !item.beforeChange(value)) return false;
    values[item.name] = value;
    item.onChange && item.onChange(values[item.name], item);
    this.removeError(item);
    this.setState({
      values
    });
  }

  fileChange(item, event) {
    let { values } = this.state;
    let filesObject = [],
      files = event.target.files;
    new Promise((resolve, reject) => {
      if (item.notEmptyClear && !files.length) resolve(values[item.name]);
      if (!files.length) resolve(filesObject);
      for (let i = 1; i <= files.length; i++) {
        let file = files[i - 1];
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function() {
          let base64 = btoa(reader.result);
          filesObject.push({
            name: file.name,
            data: 'data:' + file.type + ';base64,' + base64,
            type: file.type,
            size: file.size
          });
          if (i === files.length) {
            setTimeout(() => {
              resolve(filesObject);
            }, 0);
          }
        };
      }
    }).then(resp => {
      if (item.beforeChange && !item.beforeChange(resp)) return false;
      values[item.name] = resp;
      item.onChange && item.onChange(values[item.name], item);
      this.removeError(item);
      this.setState({
        values
      });
    });
  }

  selectChange(item, event) {
    let { values } = this.state,
      options = event.target.options,
      array = [],
      result = false;
    for (let option of options) {
      if (option.selected) array.push(option.value);
    }
    if (item.multiple) result = array;
    else result = event.target.value;
    if (item.beforeChange && !item.beforeChange(result)) return false;
    values[item.name] = result;
    item.onChange && item.onChange(values[item.name], item);
    this.removeError(item);
    this.setState({
      values
    });
  }

  checkboxChange(item, checkbox, event) {
    let { values } = this.state,
      array = [],
      dom = document.querySelectorAll(
        '[name="' + item.name + '__' + this.state.hash + '"]'
      );
    dom.forEach((e, i) => {
      if (e.checked) {
        array.push(e.value);
      }
    });
    if (item.beforeChange && !item.beforeChange(array)) return false;
    values[item.name] = array;
    item.onChange && item.onChange(values[item.name], item);
    this.removeError(item);
    this.setState({
      values
    });
  }

  radioChange(item, radio, event) {
    let { values } = this.state,
      { value } = radio;
    if (item.beforeChange && !item.beforeChange(value)) return false;
    values[item.name] = value;
    item.onChange && item.onChange(values[item.name], item);
    this.removeError(item);
    this.setState({
      values
    });
  }

  boolChange(item, event) {
    let { values } = this.state,
      { chacked } = event.target;
    if (item.beforeChange && !item.beforeChange(chacked))
      return false;
    values[item.name] = chacked;
    item.onChange && item.onChange(values[item.name], item);
    this.removeError(item);
    this.setState({
      values
    });
  }

  getDefaultValue(field) {
    let result = '';
    if (
      field.type === 'checkbox' ||
      field.type === 'select' ||
      field.type === 'file'
    )
      result = [];
    if ((field.type === 'checkbox' || field.type === 'radio') && !field.options)
      result = false;
    if (
      field.type === 'select' &&
      !field.multiple &&
      field.options &&
      field.options.length
    ) {
      result = field.options[0].value;
    }
    return field.hasOwnProperty('value') && field.value !== null
      ? field.value
      : result;
  }

  resetForm() {
    setTimeout(() => {
      let { fields } = this.state,
        values = {};
      fields &&
        fields.map((field, index) => {
          if (field.name) values[field.name] = this.resetField(field, false);
        });
      this.setState({
        values
      });
    }, 0);
  }

  resetField(item, setState = true) {
    let { values } = this.state;
    values[item.name] = this.getDefaultValue(item);
    if (setState) this.setState({ values });
    this.removeError(item);
    return values[item.name];
  }

  buildInput(item) {
    let className = 'form-control';
    if (item.type) className += ' form-control__' + item.type;
    if (item.width) className += ' form-control__' + item.width;
    if (item.className) className += ' ' + item.className;
    return (
      <input
        id={item.name + '__' + this.state.hash}
        className={className}
        placeholder={item.placeholder}
        disabled={item.disabled}
        inputMode={item.inputmode || ''}
        onChange={event => {
          this.inputChange(item, event);
        }}
        type={item.type}
        value={this.state.values[item.name] || ''}
      />
    );
  }

  buildFile(item) {
    let className = 'form-control',
      fileWrapperClassName = 'form-file';
    if (item.type) className += ' form-control__' + item.type;
    if (item.width) className += ' form-control__' + item.width;
    if (item.className) className += ' ' + item.className;
    let values = this.state.values[item.name],
      resetButton = item && item.resetButton ? item.resetButton : false;
    return (
      <div className={fileWrapperClassName}>
        <label>
          <div className="form-file-text">
            {values.length
              ? values.map((file, index) => {
                  return <span key={index}>{file.name}</span>;
                })
              : item.placeholder}
          </div>
          <input
            id={item.name + '__' + this.state.hash}
            className={className}
            placeholder={item.placeholder}
            disabled={item.disabled}
            multiple={item.multiple || false}
            onChange={event => {
              this.fileChange(item, event);
            }}
            type={item.type}
          />
        </label>
      </div>
    );
  }

  buildTextarea(item) {
    let className = 'form-control';
    if (item.type) className += ' form-control__' + item.type;
    if (item.width) className += ' form-control__' + item.width;
    if (item.className) className += ' ' + item.className;
    return (
      <textarea
        id={item.name + '__' + this.state.hash}
        className={className}
        placeholder={item.placeholder}
        disabled={item.disabled}
        onChange={event => {
          this.inputChange(item, event);
        }}
        value={this.state.values[item.name]}
      />
    );
  }

  buildSelect(item) {
    let className = 'form-control',
      multiple = item.multiple || false,
      { values } = this.state;
    if (item.type) className += ' form-control__' + item.type;
    if (item.width) className += ' form-control__' + item.width;
    if (item.className) className += ' ' + item.className;
    return (
      <select
        id={item.name + '__' + this.state.hash}
        className={className}
        multiple={multiple}
        disabled={item.disabled}
        size={multiple ? item.size || 0 : 1}
        value={values[item.name]}
        onChange={event => {
          this.selectChange(item, event);
        }}
      >
        {item.options &&
          item.options.map((option, index) => {
            return (
              <option
                key={index}
                disabled={option.disabled}
                value={option.value}
              >
                {option.text}
              </option>
            );
          })}
      </select>
    );
  }

  buildSwitcher(item) {
    let listClass = 'form-list';
    if (item.inline) listClass += ' form-list__inline';
    return (
      <div className={listClass}>
        {item.options
          ? item.options.map((switcher, index) => {
              let checked = (() => {
                  if (item.type === 'checkbox') {
                    return this.state.values[item.name]
                      ? this.state.values[item.name].indexOf(switcher.value) >=
                          0
                      : false;
                  }
                  if (item.type === 'radio') {
                    return this.state.values[item.name] === switcher.value;
                  }
                })(),
                className = 'form-list-item',
                switcherClassName = 'form-switcher form-switcher__' + item.type;
              if (checked) switcherClassName += ' form-switcher__checked';
              return (
                <label key={index} className={className}>
                  <input
                    name={item.name + '__' + this.state.hash}
                    type={item.type}
                    disabled={item.disabled || switcher.disabled}
                    onChange={event => {
                      if (item.type === 'checkbox') {
                        this.checkboxChange(item, switcher, event);
                      }
                      if (item.type === 'radio')
                        this.radioChange(item, switcher, event);
                    }}
                    value={switcher.value}
                    checked={checked}
                  />
                  <div className={switcherClassName}>
                    <div className="form-switcher-pointer" />
                    <div dangerouslySetInnerHTML={{ __html: switcher.text }} />
                  </div>
                </label>
              );
            })
          : (() => {
              let checked = this.state.values[item.name] || false,
                className = 'form-list-item',
                switcherClassName = 'form-switcher form-switcher__' + item.type;
              if (checked) switcherClassName += ' form-switcher__checked';
              return (
                <label className={className}>
                  <input
                    name={item.name + '__' + this.state.hash}
                    type={item.type}
                    disabled={item.disabled}
                    onChange={event => {
                      this.boolChange(item, event);
                    }}
                    value={item.value}
                    checked={checked}
                  />
                  <div className={switcherClassName}>
                    <div className="form-switcher-pointer" />
                    <div dangerouslySetInnerHTML={{ __html: item.text }} />
                  </div>
                </label>
              );
            })()}
      </div>
    );
  }

  buildSubmit(item) {
    let { loading } = this.state;
    return (
      <input
        type={item.type}
        className={item.className}
        disabled={loading || item.disabled}
        hidden={item.hidden}
        value={this.state.values[item.name] || item.value}
      />
    );
  }

  validation() {
    let { fields } = this.state,
      errors = [];
    fields.forEach((item, index) => {
      if (item.validation) {
        let error = item.validation(
          this.state.values[item.name],
          this.state.values
        );
        if (error) {
          fields[index]['error'] = error;
          errors.push({
            [item.name]: error
          });
        } else {
          delete fields[index]['error'];
        }
      }
    });
    this.setState({
      fields
    });
    return errors;
  }

  beforeSubmit() {
    this.props.beforeSubmit && this.props.beforeSubmit();
    this.setState({
      loading: true
    });
  }

  afterSubmit() {
    this.props.afterSubmit && this.props.afterSubmit();
    this.setState({
      loading: false
    });
  }

  submit(e) {
    return new Promise((resolve, reject) => {
      let { loading } = this.state;
      if (loading) return false;
      e && e.preventDefault();
      let errors = this.validation();
      if (errors.length) return false;
      this.beforeSubmit();
      let data = Object.assign({}, this.state.values),
        onSubmit = this.props.onSubmit && this.props.onSubmit(data, e);
      if (onSubmit && onSubmit instanceof Promise) {
        onSubmit
          .then(resp => {
            this.props.autoReset && this.resetForm();
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          })
          .finally(() => {
            this.afterSubmit();
          });
      } else {
        this.props.autoReset && this.resetForm();
        this.afterSubmit();
        resolve(this.state);
      }
    });
  }

  switcher(field) {
    switch (field.type) {
      case 'text':
        return this.buildInput(field);
      case 'password':
        return this.buildInput(field);
      case 'email':
        return this.buildInput(field);
      case 'hidden':
        return this.buildInput(field);
      case 'tel':
        return this.buildInput(field);
      case 'date':
        return this.buildInput(field);
      case 'textarea':
        return this.buildTextarea(field);
      case 'select':
        return this.buildSelect(field);
      case 'checkbox':
        return this.buildSwitcher(field);
      case 'radio':
        return this.buildSwitcher(field);
      case 'submit':
        return this.buildSubmit(field);
      case 'file':
        return this.buildFile(field);
      case 'html':
        return this.buildHtml(field);
    }
  }

  buildControl(item) {
    let className = 'form-control-wrapper',
      resetButton = item && item.resetButton ? item.resetButton : false;
    if (resetButton && resetButton.enable)
      className += ' form-control-wrapper__with-reset';
    if (item.disabled) className += ' form-control-wrapper__disabled';
    return (
      <div className={className} title={item.title}>
        {this.switcher(item)}
        {this.buildError(item)}
        {this.buildReset(item)}
      </div>
    );
  }

  buildHtml(data) {
    if (!data) return null;
    let className = 'form-html';
    if (data.inline) className += ' form-html__inline';
    if (data.className) className += ' ' + data.className;
    return <div className={className}>{data.html || data}</div>;
  }

  buildField(field, index) {
    let { loading } = this.state,
      className = 'form-field';
    if (field.width) className += ' form-field__' + field.width;
    if (field.type) className += ' form-field__' + field.type;
    if (field.error) className += ' form-field__error';
    if (field.hidden) className += ' form-field__hidden';
    if (field.wrapperClassName) className += ' ' + field.wrapperClassName;
    if (field.type === 'submit' && loading)
      className += ' form-field__' + field.type + '__loading';
    return (
      <div className={className} key={index}>
        {field.htmlBefore && this.buildHtml(field.htmlBefore)}
        {this.buildLabel(field)}
        {this.buildControl(field)}
        {field.htmlAfter && this.buildHtml(field.htmlAfter)}
      </div>
    );
  }

  buildCol(col, index) {
    let { fields } = this.state,
      className = 'form-col';
    if (col.width) className += ' form-col__' + col.width;
    return (
      <div key={index} className={className}>
        {fields
          .filter((item, index) => {
            return item.col && item.col === col.name;
          })
          .map((item, index) => {
            return this.buildField(item, index);
          })}
      </div>
    );
  }

  buildLabel(field) {
    if (!field.label) return null;
    return (
      <div className="form-label">
        <label htmlFor={field.name + '__' + this.state.hash}>
          {field.label.split('\n').map(function(item, i) {
            return (
              <div className="form-label-line" key={i}>
                {item}
                <br />
              </div>
            );
          })}
        </label>
      </div>
    );
  }

  buildError(field) {
    if (!field.error) return null;
    return <div className="form-error">{field.error}</div>;
  }

  buildReset(item) {
    let resetButton = item && item.resetButton ? item.resetButton : false;
    return resetButton && resetButton.enable ? (
      <div
        className={['form-reset', resetButton.className].join(' ')}
        title={resetButton.title}
        onClick={e => {
          e.preventDefault();
          this.resetField(item);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z" />
        </svg>
      </div>
    ) : null;
  }

  render() {
    let {
        fields,
        cols,
        className = '',
        title = '',
        loading = false
      } = this.state,
      formClass = 'form';
    if (this.props.styled) formClass += ' form__styled';
    if (loading) formClass += ' form__submitting';
    return (
      <div className={className}>
        <form
          ref={inst => {
            ref = inst;
          }}
          className={formClass}
          onSubmit={this.submit}
        >
          {title && <div className="form-title">{title}</div>}
          {cols && cols.length
            ? cols.map((col, index) => {
                return this.buildCol(col, index);
              })
            : fields &&
              fields.map((item, index) => {
                return this.buildField(item, index);
              })}
        </form>
      </div>
    );
  }
}
