// ================= HOME PAGE CAROUSEL =================

var carousel = document.querySelector("#featuredCarousel");
if (carousel) {
    console.log("Featured product carousel is ready.");
}

// ================= BACK TO TOP BUTTON =================

var topButton = document.querySelector("#topButton");
if (topButton) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            topButton.style.display = "flex";
        } else {
            topButton.style.display = "none";
        }
    });

    topButton.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ================= CART TOTAL AND SHIPPING =================

var quantityInputs =
    document.querySelectorAll(".cart-product .quantity");
var cartSubtotal =
    document.querySelector("#cartSubtotal");
var cartShipping =
    document.querySelector("#cartShipping");
var cartTotal =
    document.querySelector("#cartTotal");

function calculateCartTotal() {
    var subtotal = 0;
    quantityInputs.forEach(function (input) {
        var price = Number(input.dataset.price);
        var quantity = Number(input.value);
        subtotal = subtotal + (price * quantity);
    });

    // Calculate shipping
    var shipping = 0;
    if (subtotal > 600) {
        shipping = 0;
    } else {
        shipping = 20;
    }

    // Tax
    var tax = 13;

    // Calculate final total
    var finalTotal =
        subtotal + shipping + tax;

    // Save information for Shipping and Payment pages
    localStorage.setItem("cartSubtotal", subtotal);
    localStorage.setItem("cartShipping", shipping);
    localStorage.setItem("cartTax", tax);
    localStorage.setItem("cartFinalTotal", finalTotal);

    // Update Cart subtotal
    if (cartSubtotal) {
        cartSubtotal.textContent =
            "$" + subtotal;
    }

    // Update Cart shipping
    if (cartShipping) {
        if (shipping === 0) {
            cartShipping.textContent = "FREE";
        } else {
            cartShipping.textContent =
                "$" + shipping;
        }
    }

    // Update Cart total
    if (cartTotal) {
        cartTotal.textContent =
            "$" + finalTotal;
    }
}

// Check quantity
quantityInputs.forEach(function (input) {
    input.addEventListener("change", function () {
        if (input.value < 1) {
            alert("Quantity must be at least 1.");
            input.value = 1;
        }
        calculateCartTotal();
    });
});


// Calculate when page loads
if (quantityInputs.length > 0) {
    calculateCartTotal();
}

// ================= SHIPPING PAGE =================

var shippingSubtotal = document.querySelector("#cartSubtotal");
var shippingPrice = document.querySelector("#shippingPrice");
var shippingTax = document.querySelector("#shippingTax");
var shippingTotal = document.querySelector("#shippingTotal");
var shippingMessage = document.querySelector("#shippingMessage");

var standardShipping = document.querySelector("#standardShipping");
var nextDayShipping = document.querySelector("#nextDayShipping");

function updateShipping() {

    // Get the subtotal and tax from localStorage
    var subtotal = Number(localStorage.getItem("cartSubtotal")) || 0;
    var tax = Number(localStorage.getItem("cartTax")) || 13;

    var shipping = 20;

    // Standard Shipping
    if (standardShipping && standardShipping.checked) {

        if (subtotal > 600) {
            shipping = 0;
        } else {
            shipping = 20;
        }

        if (shippingMessage) {
            if (shipping === 0) {
                shippingMessage.textContent =
                    "Congratulations! You qualify for free standard shipping.";
            } else {
                shippingMessage.textContent =
                    "Spend more than $600 to receive free standard shipping.";
            }
        }
    }

    // Next Day Delivery always costs $20
    if (nextDayShipping && nextDayShipping.checked) {
        shipping = 20;

        if (shippingMessage) {
            shippingMessage.textContent =
                "Next Day Delivery costs $20.";
        }
    }

    // Calculate the final total
    var finalTotal = subtotal + shipping + tax;

    // Save the selected shipping and updated total
    localStorage.setItem("cartShipping", shipping);
    localStorage.setItem("cartTax", tax);
    localStorage.setItem("cartFinalTotal", finalTotal);

    // Update the shipping summary
    if (shippingSubtotal) {
        shippingSubtotal.textContent = "$" + subtotal.toFixed(2);
    }

    if (shippingPrice) {
        shippingPrice.textContent =
            shipping === 0 ? "FREE" : "$" + shipping.toFixed(2);
    }

    if (shippingTax) {
        shippingTax.textContent = "$" + tax.toFixed(2);
    }

    if (shippingTotal) {
        shippingTotal.textContent = "$" + finalTotal.toFixed(2);
    }
}

// Recalculate when the customer changes delivery options
if (standardShipping) {
    standardShipping.addEventListener("change", updateShipping);
}

if (nextDayShipping) {
    nextDayShipping.addEventListener("change", updateShipping);
}

// Calculate the summary when the Shipping page opens
if (shippingSubtotal && shippingPrice && shippingTotal) {
    updateShipping();
}

// ================= SHIPPING FORM VALIDATION =================

var shippingForm =
    document.querySelector("#shippingForm");


if (shippingForm) {

    shippingForm.addEventListener("submit", function (event) {

        var postcode =
            document.querySelector("#postcode");

        var phone =
            document.querySelector("#phone");


        // Check postcode
        if (!/^\d{4}$/.test(postcode.value)) {
            alert("Please enter a valid 4 digit postcode.");
            event.preventDefault();
            return;
        }


        // Check phone number
        if (!/^[0-9+\-\s()]{7,15}$/.test(phone.value)) {
            alert("Please enter a valid phone number.");
            event.preventDefault();
            return;
        }
    });
}

// ================= PAYMENT PAGE SUMMARY =================

var paymentSubtotal =
    document.querySelector("#paymentSubtotal");

var paymentShipping =
    document.querySelector("#paymentShipping");

var paymentTax =
    document.querySelector("#paymentTax");

var paymentTotal =
    document.querySelector("#paymentTotal");


if (paymentSubtotal && paymentShipping && paymentTotal) {
    // Get information from Cart
    var subtotal =
        Number(localStorage.getItem("cartSubtotal"));
    var shipping =
        Number(localStorage.getItem("cartShipping"));
    var tax =
        Number(localStorage.getItem("cartTax"));
    var finalTotal =
        Number(localStorage.getItem("cartFinalTotal"));

    // Update subtotal
    paymentSubtotal.textContent =
        "$" + subtotal;

    // Update shipping
    if (shipping === 0) {
        paymentShipping.textContent =
            "FREE";
    } else {
        paymentShipping.textContent =
            "$" + shipping;
    }

    // Update tax
    paymentTax.textContent =
        "$" + tax;

    // Update final total
    paymentTotal.textContent =
        "$" + finalTotal;
}

// ================= PAYMENT FORM VALIDATION =================

var paymentForm =
    document.querySelector("#paymentForm");


if (paymentForm) {
    paymentForm.addEventListener("submit", function (event) {
        var cardNumber =
            document.querySelector("#card-number");

        var expiry =
            document.querySelector("#expiry");

        var cvv =
            document.querySelector("#cvv");


        // Check card number
        if (!/^\d{16}$/.test(cardNumber.value)) {
            alert("Card number must contain 16 digits.");
            event.preventDefault();
            return;
        }


        // Check expiry date
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value)) {
            alert("Please enter the expiry date as MM/YY.");
            event.preventDefault();
            return;
        }


        // Check CVV
        if (!/^\d{3,4}$/.test(cvv.value)) {
            alert("CVV must contain 3 or 4 digits.");
            event.preventDefault();
            return;
        }

        alert("Payment details are valid.");

    });

}