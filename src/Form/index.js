import React, { Component } from 'react'
import './styles/styles.scss';
import { isNull } from 'util';
export default class Form extends Component {
  constructor(props){
    super(props);
    this.state = {
      fields: props.fields,
      cols: props.cols,
      className: props.className,
      title: props.title,
      hash: this.generateHash(),
      values: {},
      loading: false
    }
    this.submit = this.submit.bind(this);
    this.switcher = this.switcher.bind(this);
    this.hash = this.generateHash();
  }

  componentWillReceiveProps(props){
    this.setState({
      fields: props.fields,
      cols: props.cols,
      className: props.className,
      title: props.title
    })
  }

  componentWillMount(){
    let {fields, values} = this.state;
    fields && fields.map((item, index) => {
      if(item.name) values[item.name] = this.getDefaultValue(item);
    });
    this.setState({
      values
    });
  }

  onDragListener(e){
    let fileWrapper = e.target.closest('.form-control-wrapper');
    if(fileWrapper) fileWrapper.classList.add('drag-over');
  }

  offDragListener(e){
    let fileWrapper = e.target.closest('.form-control-wrapper');
    if(fileWrapper) fileWrapper.classList.remove('drag-over');
  }

  componentDidMount(){
    let files = this.refs.form.querySelectorAll('input[type="file"]');
    files.forEach((file, index) => {
      file.addEventListener('dragenter', this.onDragListener)
      file.addEventListener('dragover', this.onDragListener)
      file.addEventListener('dragleave', this.offDragListener)
      file.addEventListener('drop', this.offDragListener)
    });
  }

  componentWillUnmount(){
    let files = this.refs.form.querySelectorAll('input[type="file"]');
    files.forEach((file, index) => {
      file.removeEventListener('dragenter', this.onDragListener)
      file.removeEventListener('dragover', this.onDragListener)
      file.removeEventListener('dragleave', this.offDragListener)
      file.removeEventListener('drop', this.offDragListener)
    });
  }

  generateHash(){
		let rand = window.Math.floor((window.Math.random()) * 0x10000000000000),
			result;
		rand = rand.toString(16).substring(1),
    result = rand.split('').splice(0, 10).join('');
		return result;
  }

  inputChange(item, event){
    let {values} = this.state;
    values[item.name] = event.target.value;
    item.onChange && item.onChange(values[item.name], item);
    this.setState({
      values
    })
  }

  fileChange(item, event){
    let {values} = this.state;
    let filesObject = [],
      files = event.target.files;
    new Promise((resolve, reject) => {
      if(!files.length) resolve(filesObject);
      for(let i = 1; i <= files.length; i++){
        let file = files[i-1];
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(){
          let base64 = btoa(reader.result);
          filesObject.push({
              name: file.name,
              data: 'data:'+file.type+';base64,'+base64,
              type: file.type,
              size: file.size
          });
          if(i === files.length){
            setTimeout(() => {
              resolve(filesObject);
            }, 0);
          }
        }
      }
    }).then((resp) => {
      values[item.name] = resp;
      item.onChange && item.onChange(values[item.name], item);
      this.setState({
        values
      })
    })
  }

  selectChange(item, event){
    let {values} = this.state,
      options = event.target.querySelectorAll('option'),
      array = [];
    options.forEach((item, index) => {
      if(item.selected) array.push(item.value);
    });
    if(item.multiple)
      values[item.name] = array;
    else
      values[item.name] = event.target.value;
    item.onChange && item.onChange(values[item.name], item);
    this.setState({
      values
    })
  }

  checkboxChange(item, checkbox, event){
    let {values} = this.state,
      array = [],
      dom = document.querySelectorAll('[name="'+item.name+'__'+this.state.hash+'"]');
    dom.forEach((e, i) => {
      if(e.checked){
        array.push(e.value);
      }
    });
    values[item.name] = array;
    item.onChange && item.onChange(values[item.name], item);
    this.setState({
      values
    });
  }

  radioChange(item, radio, event){
    let {values} = this.state;
    values[item.name] = radio.value;
    item.onChange && item.onChange(values[item.name], item);
    this.setState({
      values
    });
  }

  boolChange(item, event){
    let {values} = this.state;
    values[item.name] = event.target.checked;
    item.onChange && item.onChange(values[item.name], item);
    this.setState({
      values
    })
  }

  getDefaultValue(field){
    let result = '';
    if(field.type === 'checkbox' || field.type === 'select' || field.type === 'file') result = [];
    if((field.type === 'checkbox' || field.type === 'radio') && !field.options) result = false;
    if(field.type === 'select' && !field.multiple) result = '';
    return field.hasOwnProperty('value') && !isNull(field.value) ? field.value : result;
  }

  clearForm(){
    let {fields} = this.state,
      values = {};
    fields && fields.map((field, index) => {
      if(field.name) values[field.name] = this.getDefaultValue(field);
    });
    this.setState({
      values
    });
  }

  buildInput(item){
    let className = 'form-control';
    if(item.type) className += ' form-control__'+item.type;
    if(item.width) className += ' form-control__'+item.width;
    if(item.className) className += ' '+item.className;
    return(
      <input
        id={item.name+'__'+this.state.hash}
        className={className}
        placeholder={item.placeholder}
        disabled={item.disabled}
        inputMode={item.inputmode || ''}
        onChange={(event) => {
          this.inputChange(item, event);
        }}
        type={item.type}
        value={this.state.values[item.name]}
      />
    )
  }

  buildFile(item){
    let className = 'form-control';
    if(item.type) className += ' form-control__'+item.type;
    if(item.width) className += ' form-control__'+item.width;
    if(item.className) className += ' '+item.className;
    let values = this.state.values[item.name];
    return(
      <label>
        <div className="form-file">
          <div className="form-file-text">
            {values.length ?
              values.map((file, index) => {
                return(
                  <span key={index}>{file.name}</span>
                )
              })
              :
              item.placeholder
            }
          </div>
        </div>
        <input
          id={item.name+'__'+this.state.hash}
          className={className}
          placeholder={item.placeholder}
          disabled={item.disabled}
          multiple={item.multiple || false}
          onChange={(event) => {
            this.fileChange(item, event);
          }}
          type={item.type}
        />
      </label>
    )
  }

  buildTextarea(item){
    let className = 'form-control';
    if(item.type) className += ' form-control__'+item.type;
    if(item.width) className += ' form-control__'+item.width;
    if(item.className) className += ' '+item.className;
    return(
      <textarea
        id={item.name+'__'+this.state.hash}
        className={className}
        placeholder={item.placeholder}
        disabled={item.disabled}
        onChange={(event) => {
          this.inputChange(item, event);
        }}
        value={this.state.values[item.name]}
      >
      </textarea>
    )
  }

  buildSelect(item){
    let className = 'form-control',
      multiple = item.multiple || false,
      {values} = this.state;
    if(item.type) className += ' form-control__'+item.type;
    if(item.width) className += ' form-control__'+item.width;
    if(item.className) className += ' '+item.className;
    return(
      <select
        id={item.name+'__'+this.state.hash}
        className={className}
        multiple={multiple}
        disabled={item.disabled}
        size={multiple ? item.size || 0 : 1}
        onChange={(event) => {
          this.selectChange(item, event);
        }}
      >
        {item.options && item.options.map((option, index) => {
          return(
            <option
              key={index}
              disabled={option.disabled}
              selected={(() => {
                if(multiple)
                  return values[item.name].indexOf(option.value) >= 0;
                else
                  return option.value === values[item.name]
              })()}
              value={option.value}
            >
              {option.text}
            </option>
          )
        })}
      </select>
    )
  }

  buildSwitcher(item){
    let listClass = 'form-list';
    if(item.inline) listClass += ' form-list__inline';
    return(
      <div className={listClass}>
        {item.options ? item.options.map((switcher, index) => {
          let checked = (() => {
              if(item.type === 'checkbox'){
                return this.state.values[item.name] ? this.state.values[item.name].indexOf(switcher.value) >= 0 : false;
              }
              if(item.type === 'radio'){
                return this.state.values[item.name] === switcher.value;
              }
            })(),
            className = 'form-list-item',
            switcherClassName = 'form-switcher form-switcher__'+item.type;
          if(checked) switcherClassName += ' form-switcher__checked'
          return <label key={index} className={className}>
            <input
              name={item.name+'__'+this.state.hash}
              type={item.type}
              disabled={switcher.disabled}
              onChange={(event) => {
                if(item.type === 'checkbox'){
                  this.checkboxChange(item, switcher, event);
                }
                if(item.type === 'radio')
                  this.radioChange(item, switcher, event);
              }}
              value={switcher.value}
              checked={checked} />
            <div className={switcherClassName}>
              <div className="form-switcher-pointer"></div>
              <div dangerouslySetInnerHTML={{__html: switcher.text}} />
            </div>
          </label>;
        }) :
          (() => {
            let checked = this.state.values[item.name] || false,
              className = 'form-list-item',
              switcherClassName = 'form-switcher form-switcher__'+item.type;
            if(checked) switcherClassName += ' form-switcher__checked'
            return(
              <label className={className}>
                <input
                  name={item.name+'__'+this.state.hash}
                  type={item.type}
                  disabled={item.disabled}
                  onChange={(event) => {
                    this.boolChange(item, event);
                  }}
                  value={item.value}
                  checked={checked} />
                <div className={switcherClassName}>
                  <div className="form-switcher-pointer"></div>
                  <div dangerouslySetInnerHTML={{__html: item.text}} />
                </div>
              </label>
            )
          })()
        }
      </div>
    )
  }

  buildSubmit(item){
    let {loading} = this.state;
    return(
      <input
        type={item.type}
        className={item.className}
        disabled={loading || item.disabled}
        hidden={item.hidden}
        value={this.state.values[item.name] || item.value} />
    )
  }

  validation(){
    let {fields} = this.state,
      errors = [];
    fields.forEach((item, index) => {
      if(item.validation){
        let error = item.validation(this.state.values[item.name], this.state.values);
        if(error){
          fields[index]['error'] = error;
          errors.push({
            [item.name]: error
          });
        }
        else{
          delete fields[index]['error'];
        }
      }
    });
    this.setState({
      fields
    });
    return errors;
  }

  beforeSubmit(){
    this.props.beforeSubmit && this.props.beforeSubmit();
    this.setState({
      loading: true
    })
  }

  afterSubmit(){
    this.props.afterSubmit && this.props.afterSubmit();
    this.setState({
      loading: false
    })
  }

  submit(e){
    return new Promise((resolve, reject) => {
      let {loading} = this.state;
      if(loading) return false;
      e && e.preventDefault();
      let errors = this.validation();
      if(errors.length) return false;
      this.beforeSubmit();
      let data = Object.assign({}, this.state.values),
        onSubmit = this.props.onSubmit(data, e);
      if(onSubmit instanceof Promise){
        onSubmit.then((resp) => {
          this.props.autoReset && this.clearForm();
          resolve();
        }).catch((error) => {
          reject()
        }).finally(() => {
          this.afterSubmit();
        });
      }
      else{
        this.props.autoReset && this.clearForm();
        this.afterSubmit();
        resolve();
      }
    })
  }

  switcher(field){
    switch(field.type){
      case 'text':
        return this.buildInput(field);
      case 'password':
        return this.buildInput(field);
      case 'email':
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
    }
  }

  buildControl(field){
    return (
      <div className="form-control-wrapper" title={field.title}>
        {this.switcher(field)}
      </div>
    )
  }

  buildHtml(data){
    return(
      <div className="form-html">
        {data}
      </div>
    )
  }

  buildField(field, index){
    let {loading} = this.state,
      className = 'form-field';
    if(field.width) className += ' form-field__'+field.width;
    if(field.type) className += ' form-field__'+field.type;
    if(field.error) className += ' form-field__error';
    if(field.hidden) className += ' form-field__hidden';
    if(field.wrapperClassName) className += ' '+field.wrapperClassName;
    if(field.type === 'submit' && loading) className += ' form-field__'+field.type+'__loading';
    return (
      <div
        className={className}
        key={index}
      >
        {field.htmlBefore && this.buildHtml(field.htmlBefore)}
        {this.buildLabel(field)}
        {this.buildControl(field)}
        {this.buildError(field)}
        {field.htmlAfter && this.buildHtml(field.htmlAfter)}
      </div>
    )
  }

  buildCol(col, index){
    let {fields} = this.state,
      className = 'form-col';
    if(col.width) className += ' form-col__'+col.width;
    return(
      <div key={index} className={className}>
        {fields.filter((item, index) => {
          return item.col && item.col === col.name;
        }).map((item, index) => {
          return this.buildField(item, index)
        })}
      </div>
    )
  }

  buildLabel(field){
    if(!field.label) return null;
    return(
      <div className="form-label">
        <label htmlFor={field.name+'__'+this.state.hash}>
          {field.label}
        </label>
      </div>
    )
  }

  buildError(field){
    if(!field.error) return null;
    return(
      <div className="form-error">
        {field.error}
      </div>
    )
  }

  render() {
    let {fields, cols, className = '', title = '', loading = false} = this.state,
      formClass = 'form';
    if(loading) formClass += ' form__submitting';
    return (
      <div className={className}>
        <form ref="form" className={formClass} onSubmit={this.submit}>
          {title &&
            <div className="form-title">
              {title}
            </div>
          }
          {cols && cols.length ?
            cols.map((col, index) => {
              return this.buildCol(col, index);
            })
            :
            fields && fields.map((item, index) => {
              return this.buildField(item, index)
            })
          }
        </form>
      </div>
    )
  }
}