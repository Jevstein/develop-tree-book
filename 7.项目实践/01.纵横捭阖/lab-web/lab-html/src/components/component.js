class JvtHTMLComponent {
  _prefix = '';

  constructor(props = {
    prefix: 'base-component'
  }) {
    this._prefix = props.prefix;
  }

  _getUniqueElement(name, type) {
    switch (type) {
      case 'id':    return `id-${this._prefix}${name}`;
      case 'class': return `ui-${this._prefix}${name}`;
      case 'name':  return `nm-${this._prefix}${name}`;
      default:
        return `id-${this._prefix}${name}`;
    }
  }

  getElementDom() {
    return '<div></div>';
  }

  addElement(parentElementId) {
    this.addElementByText(parentElementId, this.getElementDom());
  }

  addElementByText(parentElementId, content) {
    document.getElementById(parentElementId).innerHTML += content;
  }

  addElementByAjax(parentElementId, elementId='id-db-table', fileName='template.html') {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileName, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
        var content = doc.getElementById(elementId).innerHTML;
        document.getElementById(parentElementId).innerHTML += content;
      }
    };
    xhr.send();
  }

  addElementByFetch(parentElementId, elementId='id-db-table', fileName='template.html') {
    fetch(fileName)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const div = doc.getElementById(elementId);
      if (div) {
        document.getElementById(parentElementId).appendChild(div);
      }
    })
    .catch(error => console.error(error));
  }
}