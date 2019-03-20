{
    // indlæser en fil, som input af brugeren
    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            var fileSrc = input.id.substring(4);

            reader.onload = function (e) {
                $('#soundSrc' + fileSrc)
                    .attr('src', e.target.result)
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
}
