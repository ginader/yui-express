YUI.add('form-validate', function (Y) {
    console.log('FormValidate:add');
    window = Y.Browser.window;
    document = Y.Browser.document;
    navigator = Y.Browser.navigator;
    
    Y.FormValidate = function (config) {
        console.log('FormValidate:constructor1');
        console.log(config);
        this.debug = false;
        this.config = config;
        this.targetFormObj = null;
        this.errors = [];
        this.validators = {};
        this.renderers = {};
        this.renderer = '';
        console.log('FormValidate:constructor2');
        this.test();
        this._init(config);
        console.log('FormValidate:constructor3');
        return this;
    };
    
    Y.FormValidate.prototype = {
        _init : function (config) {
            console.log('FormValidate:init');
            this.config = config;
            console.log(this.config.targetFormId);
            this.targetFormObj = Y.one(this.config.targetFormId);
            console.log(this.targetFormObj);
            if(!this.targetFormObj){
                console.log('not found: '+this.config.targetFormId);
                return;
            }
            this.addDefaultValidators();
            this.addDefaultErrorRenderers();
            this.setErrorRenderer('above');
            this.addEvents();
            return this;
        },
        
        test : function(){
            console.log('FormValidate:test');
        },
        
        
        addValidator : function(name,func){
          this.validators[name] = func;
          return this;
        },
        
        addDefaultValidators : function(){
          this.addValidator('isEmail',function(el){
            var value = el.get('value');
            if(Y.Lang.isArray(value)){
                value = value[0];
            }
            var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return filter.test(value);
          });
          this.addValidator('isText',function(el){
              var value = el.get('value');
              if(Y.Lang.isArray(value)){
                  value = value[0];
              }
              var filter  = /^[a-zA-Z\ ]+$/;
              return filter.test(value);
          });
          this.addValidator('isNumber',function(el){
              var value = el.get('value');
              if(Y.Lang.isArray(value)){
                  value = value[0];
              }
              var filter  = /^\d+$/;
              return filter.test(value);
          });
          this.addValidator('isIpAdress',function(el){
              var value = el.get('value');
              if(Y.Lang.isArray(value)){
                  value = value[0];
              }
              var filter  = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
              return filter.test(value);
          });
        },
        
        addErrorRenderer : function(name,func){
          this.renderers[name] = func;
          return this;
        },
        
        setErrorRenderer : function(renderer){
          this.renderer = renderer;
          return this;
        },
        
        addDefaultErrorRenderers : function(){
          this.addErrorRenderer('label',{
            render : function(that){
              that.highlightErrors();
              for(var i = that.errors.length-1;i>=0;i--){
                var e = that.errors[i];
                var el = e.el;
                if(e.el.length && e.el[0].type == 'radio'){
                  el = e.el[0];
                }
                var label = that.getLabelOfObj(el);
                if(!label){
                  that.warn('Element: "'+el.name+'" has no Label!');
                  return;
                }
                var error = document.createElement("span");
                error.className = "error";
                var errormsg = document.createTextNode(e.msg+' ');
                error.appendChild(errormsg);
                label.insertBefore(error,label.childNodes[0]);
                label.focus();
              }
            },
            unrender : function(that){
              that.unhighlightErrors();
              for(var i = that.errors.length-1;i>=0;i--){
                var e = that.errors[i];
                var el = e.el;
                if(e.el.length && e.el[0].type == 'radio'){
                  el = e.el[0];
                }
                var label = that.getLabelOfObj(el);
                if(!label){
                  return;
                }
                var error = label.childNodes[0];
                label.removeChild(error);
                error = null;
              }
            }
          });
          
          this.addErrorRenderer('above',{
            render : function(that){
              that.highlightErrors();
              that.errorContainer = Y.Node.create('<div class="errors"><h3>Errors</h3></div>');
              var head = document.createElement("h3");
              var headtext = document.createTextNode("Errors");
              var ul = that.getErrorsAsList();
              console.log(that.errorContainer);
              that.errorContainer.appendChild(ul);
              that.targetFormObj.get('parentNode').insertBefore(that.errorContainer,that.targetFormObj);
              that.errorContainer.one('a').focus();
            },
            unrender : function(that){
              that.unhighlightErrors();
              if(that.errorContainer){
                that.errorContainer.remove();
                that.errorContainer = null;
              }
            }
          });
          
          this.addErrorRenderer('below',{
            render : function(that){
              that.errorContainer = document.createElement("div");
              that.errorContainer.className = "errors";
              var head = document.createElement("h4");
              var headtext = document.createTextNode("Errors");
              head.appendChild(headtext);
              that.errorContainer.appendChild(head);
              var ul = that.getErrorsAsList();
              that.errorContainer.appendChild(ul);
              that.targetFormObj.parentNode.insertBefore(that.errorContainer,that.targetFormObj.nextSibling); // only difference to "above"
              that.errorContainer.getElementsByTagName('a')[0].focus();
            },
            unrender : function(that){
              if(that.errorContainer){
                that.errorContainer.parentNode.removeChild(that.errorContainer);
                that.errorContainer = null;
              }
            }
          });
        },
        
        getErrorsAsList : function(){
          var ul = Y.Node.create('<ul>');
          for(var i=0, l=this.errors.length; i<l; i++){
            var e = this.errors[i];
            //var li = document.createElement("li");
            var li = Y.Node.create('<li>');
            //var t = document.createTextNode(e.msg);
            
            //var a = document.createElement("a");
            var a = Y.Node.create('<a href="'+'#'+e.el.get('id')+'">'+e.msg+'</a>');
            //a.href = '#'+e.el.id;
            a.on('click', function(e){
                e.preventDefault();
                console.log(this);
                var targetId = '#'+this.get('href').split('#')[1];
                console.log(targetId);
                var t = Y.one(targetId);
                if(t.get('length') && (t.item(0).get('type') == 'radio')){
                    t = t.item(0);
                }
                t.focus();
            });
            // a.onclick = function(){
            //   var targetId = this.href.split('#')[1];
            //   var t = document.getElementById(targetId);
            //   if(t.length && (t[0].type == 'radio')){
            //     t = t[0];
            //   }
            //   t.focus();
            //   return false;
            // };
            li.appendChild(a);
            ul.appendChild(li);
            console.log('errors ul:')
            console.log(ul.get('innerHTML'));
          }
          return ul;
        },
        
        highlightErrors : function(){
          for(var i=0, l=this.errors.length; i<l; i++){
            var e = this.errors[i];
            var label = null;
            if(e.el.length){
              if(e.el[0].type == "radio"){
                for(var j=0,le=e.el.length;j<le;j++){
                  this.addClassName(e.el[j],'error');
                  label = this.getLabelOfObj(e.el[j]);
                  this.addClassName(label,'error');
                }
              }else if(e.el.options){
                this.addClassName(e.el[0].parentNode,'error');
                label = this.getLabelOfObj(e.el[0].parentNode);
                this.addClassName(label,'error');
              }
            }else{
              this.addClassName(e.el,'error');
              label = this.getLabelOfObj(e.el);
              this.addClassName(label,'error');
            }
          }
        },
        
        unhighlightErrors : function(){
          for(var i=0, l=this.errors.length; i<l; i++){
            var e = this.errors[i];
            var label = null;
            if(e.el.length){
              if(e.el[0].type == "radio"){
                for(var j=0,le=e.el.length;i<le;j++){
                  this.removeClassName(e.el[j],'error');
                  label = this.getLabelOfObj(e.el[j]);
                  this.removeClassName(label,'error');
                }
              }else if(e.el.options){
                this.removeClassName(e.el[0].parentNode,'error');
                label = this.getLabelOfObj(e.el[0].parentNode);
                this.removeClassName(label,'error');
              }
            }else{
              this.removeClassName(e.el,'error');
              label = this.getLabelOfObj(e.el);
              this.removeClassName(label,'error');
            }
          }
        },
        
        addEvents : function(){
          var that = this;
          this.targetFormObj.on({
              submit: function (e) {
                  if(that.config.debug){
                      if(that.checkRules()){
                          that.log('Form would now have been sent if not in Debug Mode!');
                      }
                      e.preventDefault();
                  }else{
                      return that.checkRules();
                  }
              }
          });
        },
        
        checkRules : function(){
          this.unrenderErrors(); // evtl. existierende Fehlerliste entfernen
          this.errors = []; // neuer leerer Fehler Array
          if(!this.config.rules){
            return true; // no rules == no Form checking needed
          }
          for( var i=0, l=this.config.rules.length; i<l; i++ ){
            this.validate(this.config.rules[i]); // alle Regeln nacheinander prüfen
          }
          if(this.errors.length !== 0){
            this.renderErrors(); // Fehler vorhanden -> anzeigen
            return false; // verhindert das absenden des Forms
          }else{
            return true; // erlaubt das absenden
          }
        },
        
        validate : function(rule){
          var el = this.targetFormObj.all('[name='+rule.name+']');
          if(!el){
            this.warn('validate: element: "'+rule.name+'" not found!');
            return; // element not found - fail silently
          }

          //if(el.size() > 1){
            if(el.item(0).get('type') == "radio" && rule.required){
                console.log('type:radiobutton')
                var checked = false;
                el.each(function(node){
                    console.log(node.get('checked'));
                    if(node.get('checked')){
                        checked = true;
                    }
                })
                if(checked){
                    return;
                }
                this.addError(el.item(0),rule.requiredMsg); // Error - selection required
                return;
            }else if((el.item(0).get('nodeName').toLowerCase() == 'select') && rule.required){
                console.log('type:selectbox');
                console.log(el.item(0).get('options').item(el.item(0).get("selectedIndex")).get("value"));
                if(el.item(0).get('options').item(el.item(0).get("selectedIndex")).get("value") === ''){
                    this.addError(el.item(0),rule.requiredMsg); // Error - selection required
                    return;
                }
            }
          //}
          if(el.item(0).get('type') == "text"){
              console.log("el.get('value')");
              console.log(el.item(0).get('value'));
              console.log(!el.item(0).get('value'));
            if(!rule.required && !el.item(0).get('value')){ 
              return; // do not validate when Input is empty and not required
            }
            if(rule.required && !el.item(0).get('value')){ // Error - Input is required but empty
              this.addError(el.item(0),rule.requiredMsg);
              return;
            }
          }else if(el.item(0).get('type') == "checkbox" && rule.required){
            if(!el.item(0).get('checked')){
              this.addError(el.item(0),rule.requiredMsg); // Error - selection required
            }
            return el.item(0).get('checked'); // required checkbox is checked
          }
          if(!rule.validate){ // no validation needed
            return;
          }
          if(!this.validators[rule.validate]){ // Exception: unknown validation rule
            this.warn('validate: unknown validation rule: "'+rule.validate+'" is used on Element: "'+rule.name+'"!');
            return;
          }
          if(!this.validators[rule.validate](el)){ // Error - does not validate
            this.addError(el,rule.validatedMsg);
          }
        },
        
        addError : function(el,msg){
            console.log('add error: ',msg)
            this.errors[this.errors.length] = {el:el,msg:msg};
        },
        
        renderErrors : function(){
          if(!this.renderers[this.renderer]){
            this.warn('renderErrors: No Renderer called "'+this.renderer+'" available!');
            return;
          }
          this.renderers[this.renderer].render(this);
        },
        
        unrenderErrors : function(){
          if(!this.renderers[this.renderer]){
            this.warn('unrenderErrors: No Renderer called "'+this.renderer+'" available!');
            return;
          }
          this.renderers[this.renderer].unrender(this);
        },
        
        // Tools
        getLabelOfObj : function(el){
          var id = el.get('id');
          if(!id){
            this.warn('getLabelOfObj: The Element: "'+el.get('name')+'" has no id property!');
            return null;
          }
          var label = this.targetFormObj.one('label[for='+id+']');
          return label;
        },
        
        getClassNames : function(el){
          if(el && el.className){
            return el.className.split(" ");
          }
          return [];
        },
        
        addClassName : function(el,className){
          var classNames = this.getClassNames(el);
          classNames[classNames.length] = className;
          if(el){
            el.className = classNames.join(" ");
          }else{
            this.warn('addClassName: failed for: '+el);
          }
        },
        
        removeClassName : function(el,className){
          var classNames = this.getClassNames(el);
          for(var i=0,l=classNames.length;i<l;i++){
            if(classNames[i] == className){
              classNames[i] = "";
            }
          }
          if(el && el.className){
            el.className = classNames.join(" ");
          }
        },
        // preFillForm : function(data){
        //     var that = this;
        //     Y.log('preFillFromUrl');
        //     Y.log(data);
        //     Y.log(this);
        //     Y.log(that.targetFormObj);
        //     Y.log(this.targetFormObj);
        //     for(var name in data){
        //         if(data.hasOwnProperty(name)){
        //             Y.log(name + '=' + data[name]);
        //             //var value = data[name];
        //             //var el = that.targetFormObj.one('[name='+name+']');
        //             //Y.log(el);
        //             //if(!el){
        //               //that.warn('prefill: element: "'+rule.name+'" not found!');
        //               //continue; // element not found - fail silently
        //             //}
        //         }
        //     }
        // },
        
        log : function(msg){
            if(this.config.debug && window.console && window.console.log){
                window.console.log(msg);
            }
        },
        
        warn : function(msg){
          if(this.config.debug && window.console && window.console.warn){
            window.console.warn(msg);
          }
        }
    };
}, '1.0.0', { requires: ['node','event'] });
