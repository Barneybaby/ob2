// Generated by CoffeeScript 1.10.0
(function() {
  $(document).ready(function() {
    var cancel, cropper, fileinput, fileoutput, photocrop, submit;
    fileinput = $(".js-photocrop-fileinput");
    cropper = $(".js-photocrop-cropper");
    submit = $(".js-photocrop-submit");
    cancel = $(".js-photocrop-cancel");
    fileoutput = $(".js-photocrop-output");
    photocrop = null;
    fileinput.change(function() {
      var file, filereader, image;
      photocrop = new Photocrop(cropper, (function() {
        return fileoutput.val(photocrop.toDataURL());
      }));
      image = new Image();
      image.onload = function() {
        return photocrop.load(image);
      };
      file = fileinput.prop("files")[0];
      filereader = new FileReader();
      filereader.onload = function() {
        return image.src = filereader.result;
      };
      filereader.readAsDataURL(file);
      fileinput.parent().hide();
      cropper.show();
      return submit.show();
    });
    return cancel.click(function() {
      fileinput.wrap("<form>").parent("form").trigger("reset");
      fileinput.unwrap();
      fileinput.parent().show();
      if (photocrop !== null) {
        photocrop.clear();
      }
      cropper.hide();
      submit.hide();
      return fileinput.click();
    });
  });

}).call(this);
