var num_pages = function (current, total) {
	let num_len = String(total).length
		, cur_num = String(current);

	while (cur_num.length < num_len)
	{
		cur_num = '0' + cur_num;
	};

	return cur_num;
}

module.exports = num_pages;
