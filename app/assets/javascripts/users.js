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
    submitBtn.val("Processing...").prop('disabled', true);
    
    //Collect info from the CC fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
    
    //Use Stripe js library to check for card errors
    var error = false;
    
    //Validate CC number
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The credit card number appears to be invalid.');
    }
    
    //Validate security code
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The security code appears to be invalid.');
    }
    
    //Validate expiration date
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The expiration date appears to be invalid.');
    }
    
    if (error) {
      //If there are card errors, then don't send the input to Stripe
      submitBtn.prop('disabled', false).val("Sign Up");
    } else {
      //Send CC info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    
    
    return false;
  });
  
  //Stripe will return a card token.
  function stripeResponseHandler(status, response) {
    //Get the token from the response
    var token = response.id;
    
    //Inject card token as a hidden field into a form.
    theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token));
    
    //Submit form to Rails app.
    theForm.get(0).submit();
  }
  
});