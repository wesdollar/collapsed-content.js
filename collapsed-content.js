var collapseMe;

collapseMe = (function () {
   
    return {

        config: {
            collapseMeClass: 'collapsed-content',
            collapsedClass: 'collapsed-content-collapsed',
            expandedClass: 'collapsed-content-expanded',
            elementHeight: '',
            arrowDownClass: 'fa fa-angle-down',
            arrowUpClass: 'fa fa-angle-down collapsed-rotate-up',
            gutter: 40,
            currentTarget: '',
        },

        watchers: {},

        hooks: {

            preToggle: null,
        },

        fire: {

            hook: function (hookKey, el) {

                if (collapseMe.hooks[hookKey] !== null && collapseMe.isFunction(collapseMe.hooks[hookKey])) {

                    return collapseMe.hooks[hookKey](el);
                }
            }
        },

        toggleCollapsedContent: function (target, forceState) {

            this.config.currentTarget = target;

            try {

                var el = document.getElementById(target);

            } catch (e) {

                return false;
            }

            this.registerWatcher(target);

            this.config.elementHeight = this.getElementHeight(el);

            if (typeof forceState !== 'undefined' && forceState.length > 0) {

                switch (forceState) {

                    case 'close':

                        collapseMe.fire.hook('preToggle', el);

                        return this.swapClasses(el, this.config.expandedClass, this.config.collapsedClass);

                        break;
                    
                    case 'open':

                        collapseMe.fire.hook('preToggle', el);

                        return this.swapClasses(el, this.config.collapsedClass, this.config.expandedClass);

                        break;

                    default: //
                }
            }
            else {

                if (this.watchers[this.config.currentTarget]) {

                    return this.swapClasses(el, this.config.expandedClass, this.config.collapsedClass);
                }
                else {

                    collapseMe.fire.hook('preToggle', el);

                    return this.swapClasses(el, this.config.collapsedClass, this.config.expandedClass);
                }
            }
        },

        getAllElements: function () {

            try {

                return document.getElementsByClassName(this.config.collapseMeClass);

            } catch (e) {

                return false;
            }
        },

        toggleAll: function (optionalToggleState) {

            var optionalToggleState = optionalToggleState || false;

            var allElements = this.getAllElements();

            if (!allElements) {

                return false;
            }

            var shouldWeOpenOrClose = this.shouldWeOpenOrClose(allElements);

            for (var i = 0; i < allElements.length; i++) {

                switch (optionalToggleState) {

                    case 'open':

                        collapseMe.toggleCollapsedContent(allElements[i].id, 'open');

                        break;

                    case 'close':

                        collapseMe.toggleCollapsedContent(allElements[i].id, 'close');

                        break;

                    default:

                        collapseMe.toggleCollapsedContent(allElements[i].id, shouldWeOpenOrClose);
                }
            }

            return true;
        },

        shouldWeOpenOrClose: function (els) {

            var collapsedCount = 0;
            var expandedCount = 0;

            var els = els || false;

            if (!els) {

                return false;
            }

            for (var i = 0; i < els.length; i++) {

                var classList = els[i].classList;

                for (var ii = 0; ii < classList.length; ii++) {

                    if (classList[ii] === this.config.collapsedClass) {

                        collapsedCount++;
                    }

                    if (classList[ii] === this.config.expandedClass) {

                        expandedCount++;
                    }
                }
            }

            var decision = (collapsedCount >= expandedCount) ? 'open' : 'close';

            return decision;
        },

        removeClass: function (el, domClass) {

            return el.classList.remove(domClass);
        },

        addClass: function (el, domClass) {

            return el.classList.add(domClass);
        },

        /*  
         * @/// <param name="el" type="object">Target element; getElById before calling function</param>
         */
        swapClasses: function (el, classToRemove, classToAdd) {

            var targetName = this.config.currentTarget;
    
            var state = (classToAdd === this.config.collapsedClass) ? false : true;

            this.toggleTruthy(targetName, state);

            this.toggleParentHeight(el);
            this.toggleDropDownIcon(el);

            this.removeClass(el, classToRemove);
            this.addClass(el, classToAdd);

            return;
        },

        toggleTruthy: function (key, state) {

            return this.watchers[key] = state;
        },

        getCurrentStateClass: function (el) {

            var el = el || false;

            if (!el) {

                return false;
            }

            var classList = el.classList;

            for (var i = 0; i < classList.length; i++) {

                if (classList[i] === this.config.collapsedClass) {

                    return this.config.collapsedClass;
                }

                if (classList[i] === this.config.expandedClass) {

                    return this.config.expandedClass;
                }
            }
        },

        toggleParentHeight: function (el) {

            var parentEl = el.parentElement;

            if (this.watchers[this.config.currentTarget]) {

                parentEl.setAttribute('style', 'height: ' + this.config.elementHeight + 'px;');
            }
            else {

                parentEl.setAttribute('style', 'height: 0;');
            }

                return;
        },

        getElementHeight: function (el) {

            var currentState = this.getCurrentStateClass(el);

            if (currentState === this.config.expandedClass) {

                return el.scrollHeight;
            }

            return el.scrollHeight + this.config.gutter;
        },

        toggleDropDownIcon: function (el) {

            try {

                var icon = el.parentElement.previousElementSibling.getElementsByTagName('i')[0];

                if (this.watchers[this.config.currentTarget]) {

                    icon.className = this.config.arrowUpClass;
                }
                else {

                    icon.className = this.config.arrowDownClass;
            }

                return true;

            } catch (e) {

                return false;
            }
        },

        registerWatcher: function (target) {

            if (typeof this.watchers[target] === 'undefined') {

                return this.watchers[target] = false;
            }

            return false;
        },

        isFunction: function(functionToCheck) {

            if (typeof functionToCheck === 'function') {

                return true;
            }
            else {

                return false;
            }
        }
    }
})();
