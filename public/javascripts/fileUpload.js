const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--book-cover-width-large') !=null && 
rootStyles.getPropertyValue('--book-cover-width-large') !== '') {
    ready()
} else {
    document.getElementById('main.css').addEventListener('load', ready)
}

// stating the ready function
function ready () {
    // data from css
    // return as string so we parseFloat the result into float
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
    const coverRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
    const coverHeight = coverWidth / coverRatio

    document.addEventListener('DOMContentLoaded', function() {
        // Register any plugins
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileEncode);
        FilePond.registerPlugin(FilePondPluginImageResize);

        // Create FilePond object
        const inputElement = document.querySelector('input[type="file"]');
        const pond = FilePond.create(inputElement);

        FilePond.setOptions({
            stylePanelAspectRatio: 1 / coverRatio,
            imageResizeTargetWidth: coverWidth,
            imageResizeTargetHeight: coverHeight
        })

        // parse the file for filepond to use
        FilePond.parse(document.body);
    }); 
}



