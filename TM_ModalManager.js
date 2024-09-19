
function ModalManager(parent_element) {
    this.parent_element = parent_element;
    this.active_modal_name = null;

    let modals_manager_obj = {};
    let opening_display_style = parent_element.dataset.opening_display;
    let on_out_hide = parent_element.dataset.on_out_hide;
    let global_this = this;

    parent_element.style.zIndex = parent_element.dataset.z_index;

    this.parent_element.onclick = function (event) {
        if (event.target === event.currentTarget) {
            if (on_out_hide === 'true') {
                global_this.hide(global_this.active_modal_name);
            }
        }
    }

    this.add_modal = function (...arr_of_elements_selectors) {
        for (let element_selector of arr_of_elements_selectors) {
            let element = document.querySelector(element_selector);
            let data_modal_name = element.dataset.modal_name;
            modals_manager_obj[data_modal_name] = { element: element, parent: element.parentElement };
        }
    }
    this.show = function (modal_name) {

        if (this.active_modal_name) {
            this.hide(this.active_modal_name);
        }
        this.parent_element.style.display = opening_display_style;

        let modal_obj = modals_manager_obj[modal_name];
        let modal_element = modal_obj.element;

        let flex_justify_content = modal_element.dataset.flex_justify_content;
        let flex_align_items = modal_element.dataset.flex_align_items;

        if (flex_justify_content || flex_align_items) {
            this.parent_element.style.display = 'flex';
            this.parent_element.style.justifyContent = flex_justify_content;
            this.parent_element.style.alignItems = flex_align_items;
        }

        this.parent_element.appendChild(modal_element);
        modal_element.style.animation = modal_element.dataset.show_animation;
        this.active_modal_name = modal_name;
    }
    this.hide = function (modal_name) {
        if (!modal_name) { return; }

        let modal_obj = modals_manager_obj[modal_name];
        let modal_element = modal_obj.element;
        let data_anim = modal_element.dataset.hide_animation;
        if (data_anim && data_anim !== 'none') {
            modal_element.style.animation = data_anim;
            modal_element.onanimationend = function () {
                let modal_element_parent = modal_obj.parent;
                modal_element_parent.appendChild(modal_element);
                global_this.active_modal_name = null;
                global_this.parent_element.style.display = 'none';
            }
        }
        else {
            let modal_element_parent = modal_obj.parent;
            modal_element_parent.appendChild(modal_element);
            this.active_modal_name = null;
            this.parent_element.style.display = 'none';
        }
    }
    this.return_parent_element = function () { return this.parent_element; }
}
