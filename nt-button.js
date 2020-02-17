class NaughtyButton extends HTMLElement {
    constructor() {
        super();
        this._button;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            .nt-button {
                min-width: 100px;
                min-height: 32px;
                padding: 4px 8px;
                background-color: #1a53ff;
                border: none;
                border-radius: 16px;
                color: #fff;
                cursor: pointer;
                position: unset;
                -webkit-transition: all 0.1s ease-in-out 0s;
                -moz-transition: all 0.1s ease-in-out 0s;
                -o-transition: all 0.1s ease-in-out 0s;
                transition: all 0.1s ease-in-out 0s;
            }
            .nt-button:hover, .nt-button:focus {
                outline: none;
                background-color: #0040ff;
            }
            .nt-button:active {
                background-color: #0039e6;
            }
            .nt-button--disabled,
            .nt-button--disabled:hover,
            .nt-button--disabled:focus {
                background-color: #e6e6e6;
                cursor: no-drop;
            }
        </style>
        <button class="nt-button"><slot><slot></button>
        `
    }
    static get observedAttributes() {
        return ['disabled', 'naughty'];
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }
    get naughty() {
        return this.hasAttribute('naughty');
    }
    get onClick() {
        if (this.hasAttribute('onclick') && !this.disabled) {
            return eval(this.getAttribute('onclick'));
        }
        return () => undefined;
    }
    connectedCallback() {
        const button = this.shadowRoot.querySelector(".nt-button");
        button.addEventListener('mouseenter', this._teleport.bind(this));
        button.addEventListener('click', this.onClick.bind(this));
        button.style.left = `${button.getBoundingClientRect().left}px`;
        button.style.top = `${button.getBoundingClientRect().top}px`;
        this._button = button;
    }
    disconnectedCallback() {
        this._button && this._button.removeEventListener('mouseenter', this._move);
        this._button && this._button.removeEventListener('click', this.onClick);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.disabled) {
          this.setAttribute('tabindex', '-1');
          this.setAttribute('aria-disabled', 'true');
          this.shadowRoot.querySelector(".nt-button").classList.add('nt-button--disabled')
        } else {
          this.setAttribute('tabindex', '0');
          this.setAttribute('aria-disabled', 'false');
        }
    }
    _teleport() {
        if (this.naughty && !this.disabled) {
            const button = this.shadowRoot.querySelector(".nt-button");
            setTimeout(() => {
                button.style.left = `${Math.random() * (
                    window.innerWidth - button.getBoundingClientRect().width)}px`;
                button.style.top = `${Math.random() * (
                    window.innerHeight - button.getBoundingClientRect().height)}px`;
                button.style.position = 'absolute';
            }, 100);
        }
    }
}

customElements.define('nt-button', NaughtyButton);
