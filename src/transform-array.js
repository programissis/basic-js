const { NotImplementedError } = require('../extensions/index.js');

/**
 * Create transformed array based on the control sequences that original
 * array contains
 *
 * @param {Array} arr initial array
 * @returns {Array} transformed array
 *
 * @example
 *
 * transform([1, 2, 3, '--double-next', 4, 5]) => [1, 2, 3, 4, 4, 5]
 * transform([1, 2, 3, '--discard-prev', 4, 5]) => [1, 2, 4, 5]
 *
 */
function transform(arr) {
	if (!Array.isArray(arr)) {
		throw new Error("'arr' parameter must be an instance of the Array!");
	}

	let result = [];
	let activeFlag = null;
	let wasAffected = false;

	for (element of arr) {
		if (typeof element === 'string' && element.startsWith('--')) {
			activeFlag = element;
		} else {
			if (activeFlag === '--discard-next' && !wasAffected) {
				activeFlag = null;
				wasAffected = true;
				continue;
			}

			if (activeFlag === '--discard-prev' && !wasAffected) {
				result.pop();
			} else if (activeFlag === '--double-next') {
				result.push(element);
			} else if (activeFlag === '--double-prev' && !wasAffected) {
				const prev = result[result.length - 1];
				if (prev) {
					result.push(prev);
				}
			}

			activeFlag = null;
			wasAffected = false;
			result.push(element);
		}
	}

	return result;
}

module.exports = {
	transform,
};
