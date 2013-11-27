$(document).ready(function() {


	var snow;

	function loadConfig(file) {
		$.ajax({
			url:'config/'+ file +'.json'
		}).done(function(preset) {
			if(!snow) {
				snow = new Snow(preset);
				snow.start();
			}else {
				snow.destroy();
				snow.config(preset);
				snow.create();
			}
		});
	}

	$('#preset').change(function() {
		loadConfig($(this).val());
	}).trigger('change');


});