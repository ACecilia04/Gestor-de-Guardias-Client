	$(document).ready(function()
	{
		// Login Form Label Focusing
		$(".login-form .form-group:has(label)").each(function(i, el)
		{
			var $this = $(el),
				$label = $this.find('label'),
				$input = $this.find('.form-control');

			$input.on('focus', function()
			{
				$this.addClass('is-focused');
			});

			$input.on('keydown', function()
			{
				$this.addClass('is-focused');
			});

			$input.on('blur', function()
			{
				$this.removeClass('is-focused');

				if($input.val().trim().length > 0)
				{
					$this.addClass('is-focused');
				}
			});

			$label.on('click', function()
			{
				$input.focus();
			});

			if($input.val().trim().length > 0)
			{
				$this.addClass('is-focused');
			}
		});
    });