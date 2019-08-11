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
      types: {},
      errors: {},
      loading: false
    };
    this.submit = this.submit.bind(this);
    this.switcher = this.switcher.bind(this);
    this.hash = this.generateHash();
  }

  getAllFields() {
    let { fields } = this.state,
      flatFields = [],
      returnAllChilds = field => {
        if (field.fields) {
          field.fields.forEach((field, index) => {
            returnAllChilds(field);
          });
        } else {
          flatFields.push(field);
        }
      };
    fields.forEach((field, index) => {
      returnAllChilds(field);
    });
    return flatFields;
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
    let { values, types, errors } = this.state,
      fields = this.getAllFields();
    fields &&
      fields.map((item, index) => {
        if (item.name) {
          values[item.name] = this.getDefaultValue(item);
          types[item.name] = item.type;
        }
      });
    this.setState({
      values,
      types,
      errors
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
    let { errors } = this.state;
    delete errors[item.name];
    this.setState({
      errors
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
      { checked } = event.target;
    if (item.beforeChange && !item.beforeChange(checked)) return false;
    values[item.name] = checked;
    item.onChange && item.onChange(values[item.name], item);
    this.removeError(item);
    this.setState({
      values
    });
  }

  getDefaultValue(field) {
    let { types } = this.state,
      result = '',
      type = types[field.name] || field.type;
    if (type === 'checkbox' || type === 'select' || type === 'file')
      result = [];
    if ((type === 'checkbox' || type === 'radio') && !field.options)
      result = false;
    if (
      type === 'select' &&
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
      let values = {},
        fields = this.getAllFields();
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
    let { types, values } = this.state,
      className = 'form-control';
    if (item.type) className += ' form-control__' + item.type;
    if (item.width) className += ' form-control__' + item.width;
    if (item.className) className += ' ' + item.className;
    return (
      <React.Fragment>
        <input
          id={item.name + '__' + this.state.hash}
          className={className}
          placeholder={item.placeholder}
          disabled={item.disabled}
          inputMode={item.inputmode || ''}
          onChange={event => {
            this.inputChange(item, event);
          }}
          type={types[item.name]}
          value={values[item.name] || ''}
        />
        {this.buildPasswordSwitch(item)}
      </React.Fragment>
    );
  }

  switchField(name, to) {
    let { types } = this.state;
    types[name] = to;
    this.setState({
      types
    });
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
      <button
        type={item.type}
        className={item.className}
        disabled={loading || item.disabled}
        hidden={item.hidden}
      >
        {this.state.values[item.name] || item.value}
        <i
          className={[
            'form-spinner',
            loading ? 'form-spinner__active' : ''
          ].join(' ')}
        />
      </button>
    );
  }

  validation() {
    let { errors, values } = this.state,
      fields = this.getAllFields();
    fields.forEach((item, index) => {
      if (item.validation) {
        let error = item.validation(values[item.name], values);
        if (error) {
          errors[item.name] = error;
        } else {
          delete errors[item.name];
        }
      }
    });
    this.setState({
      errors
    });
    return errors;
  }

  beforeSubmit() {
    this.props.beforeSubmit && this.props.beforeSubmit(this);
    this.setState({
      loading: true
    });
  }

  afterSubmit() {
    this.props.afterSubmit && this.props.afterSubmit(this);
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
      if (Object.keys(errors).length) return false;
      this.beforeSubmit();
      let data = Object.assign({}, this.state.values),
        onSubmit = this.props.onSubmit && this.props.onSubmit(data, this, e);
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
      case 'fields':
        return this.fieldsBuilder(field.fields);
    }
  }

  getFieldStatus(item) {
    let { errors, values } = this.state,
      { name } = item,
      fields = this.getAllFields(),
      index = fields.findIndex((item, index) => {
        return item.name === name;
      }),
      validation = fields[index].validation;
    if(!values[name]) return false;
    if ((validation && validation(values[name], values)) || errors[name]) return 'error';
    if (values[name]) return 'success';
    return false;
  }

  buildControl(item) {
    let className = 'form-control-wrapper',
      classNameInner = 'form-control-wrapper-inner',
      resetButton = item && item.resetButton ? item.resetButton : false,
      fieldStatus = this.getFieldStatus(item);
    if (resetButton && resetButton.enable)
      className += ' form-control-wrapper__with-reset';
    if (item.disabled) className += ' form-control-wrapper__disabled';
    if(item.statusIcon && item.statusIcon.enable) classNameInner += ' form-control-wrapper-inner__with-status'
    if (fieldStatus) {
      className += ' form-control-wrapper__' + fieldStatus;
      classNameInner += ' form-control-wrapper-inner__' + fieldStatus;
    }
    if (item.switchButton && item.switchButton.enable)
      classNameInner += ' form-control-wrapper-inner__with-button';
    return (
      <div className={className} title={item.title}>
        <div className={classNameInner}>{this.switcher(item)}</div>
        {this.buildError(item)}
        {this.buildResetButton(item)}
      </div>
    );
  }

  buildHtml(data) {
    if (!data) return null;
    let html = data;
    if (data instanceof Function) {
      html = data(this);
    }
    if (data.html) {
      if (data.html instanceof Function) html = data.html(this);
      else html = data.html;
    }
    let className = 'form-html';
    if (data.inline) className += ' form-html__inline';
    if (data.className) className += ' ' + data.className;
    return <div className={className}>{html}</div>;
  }

  buildField(field, index) {
    let { loading, types } = this.state,
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
        {this.fieldsBuilder(
          fields.filter((item, index) => {
            return item.col && item.col === col.name;
          })
        )}
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
    let { errors } = this.state,
      error = errors[field.name];
    if (!error) return null;
    return <div className="form-error">{error}</div>;
  }

  buildResetButton(item) {
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

  buildPasswordSwitch(item) {
    let { types } = this.state,
      type = types[item.name];
    if (
      item.type !== 'password' ||
      !item.switchButton ||
      !item.switchButton.enable
    )
      return null;
    return (
      <div
        className={[
          'form-switch',
          item.switchButton && item.switchButton.className
            ? item.switchButton.className
            : ''
        ].join(' ')}
        title={(item.switchButton && item.switchButton.title) || ''}
        onClick={e => {
          e.preventDefault();
          !item.disabled &&
            this.switchField(
              item.name,
              type === 'password' ? 'text' : 'password'
            );
        }}
      >
        {type === 'password' ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482.8 482.8">
            <path
              d="M396,210.4h-7.1v-62.9C388.9,66.2,322.8,0,241.4,0C160.1,0,93.9,66.1,93.9,147.5c0,1.9,0.7,61.3,1.4,62.9
			c2,4.9,6.2,3.6,11.8,3.6c5.1,0,11.3,0.5,13.6-3.6c1.1-2,0.1-60.5,0.1-62.9c0-66.4,54-120.5,120.5-120.5
			c66.4,0,120.5,54,120.5,120.5v62.9c-88.9,0-177.7,0-266.6,0c-2.8,0-5.6,0-8.4,0c-1.7,0-11,0.2-18.4,7.6
			c-4.7,4.7-7.7,11.2-7.7,18.4v168.1c0,43.1,35.1,78.2,78.2,78.2h204.9c43.1,0,78.2-35.1,78.2-78.2V236.5
			C422,222.1,410.4,210.4,396,210.4z M395,404.6c0,28.2-22.9,51.2-51.2,51.2H139c-28.2,0-51.2-22.9-51.2-51.2V237.4H395V404.6
			L395,404.6z"
            />
            <path
              d="M241.4,399.1c27.9,0,50.5-22.7,50.5-50.5c0-27.9-22.7-50.5-50.5-50.5c-27.9,0-50.5,22.7-50.5,50.5
			S213.6,399.1,241.4,399.1z M241.4,325c13,0,23.5,10.6,23.5,23.5s-10.5,23.6-23.5,23.6S218,361.5,218,348.6S228.4,325,241.4,325z"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482.8 482.8">
            <path
              d="M395.95,210.4h-7.1v-62.9c0-81.3-66.1-147.5-147.5-147.5c-81.3,0-147.5,66.1-147.5,147.5c0,7.5,6,13.5,13.5,13.5
			s13.5-6,13.5-13.5c0-66.4,54-120.5,120.5-120.5c66.4,0,120.5,54,120.5,120.5v62.9h-275c-14.4,0-26.1,11.7-26.1,26.1v168.1
			c0,43.1,35.1,78.2,78.2,78.2h204.9c43.1,0,78.2-35.1,78.2-78.2V236.5C422.05,222.1,410.35,210.4,395.95,210.4z M395.05,404.6
			c0,28.2-22.9,51.2-51.2,51.2h-204.8c-28.2,0-51.2-22.9-51.2-51.2V237.4h307.2L395.05,404.6L395.05,404.6z"
            />
            <path
              d="M241.45,399.1c27.9,0,50.5-22.7,50.5-50.5c0-27.9-22.7-50.5-50.5-50.5c-27.9,0-50.5,22.7-50.5,50.5
			S213.55,399.1,241.45,399.1z M241.45,325c13,0,23.5,10.6,23.5,23.5s-10.5,23.6-23.5,23.6s-23.5-10.6-23.5-23.5
			S228.45,325,241.45,325z"
            />
          </svg>
        )}
      </div>
    );
  }

  colsBuilder(cols) {
    return cols.map((col, index) => {
      return this.buildCol(col, index);
    });
  }

  fieldsBuilder(fields) {
    return (
      fields &&
      fields.map((item, index) => {
        return this.buildField(item, index);
      })
    );
  }

  buildTitle(title) {
    if (!title) return null;
    return (
      <div className="form-title">
        {title.htmlBefore && (
          <div className="form-title-html form-title-html__before">
            {this.buildHtml(title.htmlBefore)}
          </div>
        )}
        <div className="form-title-text">{title.text || title}</div>
        {title.htmlAfter && (
          <div className="form-title-html form-title-html__after">
            {this.buildHtml(title.htmlAfter)}
          </div>
        )}
      </div>
    );
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
    if (this.props.theme) formClass += ' form__' + this.props.theme;
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
          {this.buildTitle(title)}
          <div className="form-body">
            {cols && cols.length
              ? this.colsBuilder(cols)
              : fields && this.fieldsBuilder(fields)}
          </div>
        </form>
      </div>
    );
  }
}
