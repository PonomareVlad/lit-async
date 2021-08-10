import {LitElement, html} from 'lit';

export default class NestedComponent extends LitElement {
  render() {
    return html`
      <div style='border: 1px dotted'>Nested component</div>`;
  }
}

customElements.define('nested-component', NestedComponent);
