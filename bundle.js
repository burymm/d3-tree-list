const TreeListMapper = window.TreeListMapper;

document.addEventListener('DOMContentLoaded', () => {
    const instance = TreeListMapper();
    instance.init({
        source: 'data-r.json',
        target: 'data-r2.json',
        links: 'links.json',
    });
});
