/**
 * @created : 2024/05/09
 * @author  : Jevstein
 * @desc    : bitmap开关, 支持数组或字符串
 */

class JvtBitmapSwitch {
  /**
   * @param {Array|String} value 值数组或字符串，字符串格式为 '123,345,666'
   * @param {Number} binaryLenth 二进制位长度
   * @param {Function} onChange 值改变时的回调函数
   */
  static async set(value, index, isChecked, option) {
    return new Promise(resolve => {
      const obj = new JvtBitmapSwitch({
        value,
        binaryLenth: option?.binaryLenth,
        onChange: (data) => {
          value = data;
          resolve(value);
        }
      });
      obj.setChecked(index, isChecked);
    });
  }

  /**
   * @param {Array|String} value 值数组或字符串，字符串格式为 '123,345,666'
   * @param {Number} index 索引
   * @param {Object} option 配置项
   * @param {Number} option.binaryLenth 二进制位长度
   * @return {Boolean} 选中状态
   */
  static get(value, index, option) {
    const obj = new JvtBitmapSwitch({ value, binaryLenth: option?.binaryLenth });
    return obj.getChecked(index);
  }

  _values = []; // [123,345,666] 或 '123,345,666'
  baseBbits = 30;
  _onChange = undefined;
  _valueType = 'array';

  constructor(props = {
    value: [],
    binaryLenth: 30,
    onChange
  }) {
    this._valueType = (typeof props.value);
    this._values = (this._valueType === 'string') ? props.value.split(',') : props.value;
    this._binaryLenth = Number(props.binaryLenth) || 30;
    this._onChange = props.onChange;
  }

  setChecked(index, isChecked) {
    const idx = Math.trunc(index / this._binaryLenth);
    const mask = 1 << (index % this._binaryLenth);
    this._values[idx] = isChecked ? (Number(this._values[idx]) | mask) : (Number(this._values[idx]) & ~mask);

    const value = (this._valueType === 'string') ? this._values.join(',') : this._values;
    this._onChange && this._onChange({ 
      value, 
      index, 
      isChecked,
      subIndex: idx, 
      subValue: Number(this._values[idx]),
    });
  }

  getChecked(index) {
    const idx = Math.trunc(index / this._binaryLenth);
    const mask = 1 << (index % this._binaryLenth);
    return (Number(this._values[idx]) & mask) === mask;
  }

  getValue(index) {
    const idx = Math.trunc(index / this._binaryLenth);
    return Number(this._values[idx]);
  }

  getValueByIdx(idx) {
    return Number(this._values[idx]);
  }

  getCount() {
    return this._values.length;
  }

  getBinaryLenth() {
    return this._binaryLenth;
  }
}