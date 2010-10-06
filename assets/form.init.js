/* usage: */
YUI().use('form-validate', function (Y) {
    Y.on("domready", function(){
        testForm = new Y.FormValidate({
            targetFormId: "#test-form1",
            // debug:true,
            rules:rules
        });
        testForm.addValidator('isGermanPLZ',function(el){
          var filter = /^\d{5,5}$/;
          return filter.test(el.get('value'));
        });
        testForm.setErrorRenderer('above');
        
    });
});
