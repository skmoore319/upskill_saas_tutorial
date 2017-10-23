/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
  
  var theForm = $('#pro-form');
  var submitBtn = $('#form-signup-btn');
  
  //Set Stripe public key.
  Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
  
  //When user clicks form submit button,
  //prevent default submission behavior.
  submitBtn.click(function(event){
    event.preventDefault();
    
    //Collect info from the CC fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
    //Send CC info to Stripe.
    Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
    
  });
  
  
  
  //Stripe will return a card token.
  //Inject card token as a hidden field into a form.
  //Submit form to Rails app.
});