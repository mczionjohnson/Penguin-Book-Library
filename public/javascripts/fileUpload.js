document.addEventListener('DOMContentLoaded', function() {
    // Register any plugins
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileEncode);
    FilePond.registerPlugin(FilePondPluginImageResize);

    // Create FilePond object
    const inputElement = document.querySelector('input[type="file"]');
    const pond = FilePond.create(inputElement);

    FilePond.setOptions({
        stylePanelAspectRatio: 150 / 100,
        imageResizeTargetWidth: 100,
        imageResizeTargetHeight: 150
    })

    // parse the file for filepond to use
    FilePond.parse(document.body);
}); 


