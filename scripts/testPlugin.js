// Test plugin script that changes the text color of all elements on the page
(function() {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => el.style.color = 'blue');
    console.log('Test plugin executed');
})();
