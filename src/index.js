import './styles.scss'; // Import SCSS

class NumberInputControls {
    constructor(options = {}) {
        const defaultOptions = {
            selector: '.number-modern',
            skin: 'skin-1',
            onPlus: null,
            onMinus: null,
            bootstrapConfig: {
                size: '',
                buttonClassMinus: 'btn btn-default',
                buttonClassPlus: 'btn btn-default',
            }
        };
        this.options = { ...defaultOptions, ...options };

        this.validSkins = ['skin-1', 'skin-2', 'skin-3', 'skin-4', 'skin-bootstrap', 'skin-bootstrap3'];
        this.options.skin = this.validSkins.includes(this.options.skin) ? this.options.skin : 'skin-1';

        this.init();
    }

    init() {
        $(document).ready(() => {
            $(this.options.selector).each((_, input) => {
                this.transformInput($(input));
            });
        });
    }

    transformInput($input) {
        const attributes = $input.prop('attributes');
        let attributesHTML = '';
        let min = parseFloat($input.attr('min')) || 1;  // Default to 1 if min is not set or invalid
        let max = parseFloat($input.attr('max')) || Infinity; // Default to Infinity if max is not set or invalid
        let step = parseFloat($input.attr('step')) || 1; // Default to 1 if step is not set or invalid

        // Validate the attributes
        if (isNaN(min)) min = 1;
        if (isNaN(max)) max = Infinity;
        if (isNaN(step)) step = 1;

        // Generate HTML for attributes
        for (let i = 0; i < attributes.length; i++) {
            const attr = attributes[i];
            attributesHTML += `${attr.name}="${attr.value}" `;
        }

        const numBlockHTML = this.generateSkinHTML(this.options.skin, $input, min, max, step, attributesHTML);
        const $numBlock = $(numBlockHTML);
        $input.replaceWith($numBlock);

        const $newInput = $numBlock.find('input');
        const $minus = $numBlock.find('.minus');
        const $plus = $numBlock.find('.plus');

        // Initialize button states
        this.updateButtonStates($newInput, $minus, $plus, min, max);

        // Attach event listeners
        $minus.on('click', () => this.handleMinus($newInput, $minus, $plus, min, max));
        $plus.on('click', () => this.handlePlus($newInput, $minus, $plus, min, max));

        // Handle input changes
        $newInput.on('input', () => this.handleInputChange($newInput, $minus, $plus, min, max));
    }

    generateSkinHTML(skin, $input, min, max, step, attributesHTML) {
        const value = $input.val() || min;

        if (skin === 'skin-bootstrap') {
            const sizeClassGroup = this.options.bootstrapConfig.size ? `input-group-${this.options.bootstrapConfig.size}` : '';
            const buttonClassMinus = this.options.bootstrapConfig.buttonClassMinus ? `${this.options.bootstrapConfig.buttonClassMinus}` : '';
            const buttonClassPlus = this.options.bootstrapConfig.buttonClassPlus ? `${this.options.bootstrapConfig.buttonClassPlus}` : '';
            return `
                <div class="input-group ${sizeClassGroup} ${skin}"> 
                    <button type="button" class="${buttonClassMinus} minus">-</button> 
                    <input id="after" class="form-control" type="number" value="${value}" min="${min}" max="${max}" step="${step}" ${attributesHTML}> 
                    <button type="button" class="${buttonClassPlus} plus">+</button> 
                </div>`;
        } else if (skin === 'skin-bootstrap3') {
            const sizeClassGroup = this.options.bootstrapConfig.size ? `input-group-${this.options.bootstrapConfig.size}` : '';
            const buttonClassMinus = this.options.bootstrapConfig.buttonClassMinus ? `${this.options.bootstrapConfig.buttonClassMinus}` : '';
            const buttonClassPlus = this.options.bootstrapConfig.buttonClassPlus ? `${this.options.bootstrapConfig.buttonClassPlus}` : '';
            return `
                <div class="input-group ${sizeClassGroup} ${skin}">
                    <span class="input-group-btn">
                        <button type="button" class="${buttonClassMinus} minus">-</button>
                    </span>
                    <input id="after" class="form-control" type="number" value="${value}" min="${min}" max="${max}" step="${step}" ${attributesHTML}>
                    <span class="input-group-btn">
                        <button type="button" class="${buttonClassPlus} plus">+</button>
                    </span>
                </div>`;
        }

        switch (skin) {
            case 'skin-3':
                return `
                <div class="num-block ${skin}">
                    <input type="number" class="in-num" value="${value}" min="${min}" max="${max}" step="${step}" ${attributesHTML}>
                    <div class="num-nav">
                        <span class="plus"></span>
                        <span class="minus disabled"></span>
                    </div>
                </div>`;
            case 'skin-4':
                return `
                <div class="num-block ${skin}">
                    <span class="plus"></span>
                    <input type="number" class="in-num" value="${value}" min="${min}" max="${max}" step="${step}" ${attributesHTML}>
                    <span class="minus disabled"></span>
                </div>`;
            default:
                return `
                <div class="num-block ${skin}">
                    <span class="minus disabled"></span>
                    <input type="number" class="in-num" value="${value}" min="${min}" max="${max}" step="${step}" ${attributesHTML}>
                    <span class="plus"></span>
                </div>`;
        }
    }

    handleMinus($input, $minus, $plus, min, max) {
        let count = parseFloat($input.val()) - 1;
        count = count < min ? min : count;
        $input.val(count);

        this.updateButtonStates($input, $minus, $plus, min, max);

        $input.trigger('change');
        if (this.options.onMinus) {
            this.options.onMinus(count);
        }
    }

    handlePlus($input, $minus, $plus, min, max) {
        let count = parseFloat($input.val()) + 1;
        count = count > max ? max : count;
        $input.val(count);

        this.updateButtonStates($input, $minus, $plus, min, max);

        $input.trigger('change');
        if (this.options.onPlus) {
            this.options.onPlus(count);
        }
    }

    handleInputChange($input, $minus, $plus, min, max) {
        let value = parseFloat($input.val());

        if (isNaN(value)) {
            value = min; // Reset to min if input is invalid
            $input.val(value);
        }

        value = Math.max(min, Math.min(max, value)); // Clamp value between min and max
        $input.val(value);

        this.updateButtonStates($input, $minus, $plus, min, max);
    }

    updateButtonStates($input, $minus, $plus, min, max) {
        const value = parseFloat($input.val());

        if (value <= min) {
            $minus.addClass('disabled');
        } else {
            $minus.removeClass('disabled');
        }

        if (value >= max) {
            $plus.addClass('disabled');
        } else {
            $plus.removeClass('disabled');
        }
    }
}

// Expose the module globally
window.NumberInputControls = NumberInputControls;