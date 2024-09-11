// Test plugin script that highlights all paragraphs on the page
`(function() {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => p.style.backgroundColor = 'yellow');
})();`