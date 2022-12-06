const VALID_TEMPLATE_TYPES = ["blocks", "attachments"];

/**
 * Get environments name within the string
 *
 * @param {String} str
 * @returns {Array} Array of environments name within the given string
 */
const getTemplateEnvs = (str) => str.match(/\$\{?([A-Z0-9_]+)\}?/gm);

/**
 * Trim the linux environment prefix/suffix ${} from an array of environments
 *
 * @param {Array} envs
 * @returns {Array} Array of environments name without $ or ${} tag
 */
const trimTemplateEnvs = (envs) => envs.map((env) => env.replace(/\$\{?([A-Z0-9_]+)\}?/, "$1"));

/**
 * Parse environments variables (envs) within template object
 *
 * @param {Object} template
 *
 * @returns {String} parsed template
 */
const parseTemplateEnvs = (template) => {
    let stringTemplate = JSON.stringify(template);
    let templateEnvs = getTemplateEnvs(stringTemplate);
    let envs = trimTemplateEnvs(templateEnvs);
    templateEnvs.forEach((tEnv, i) => {
        stringTemplate = stringTemplate.replaceAll(tEnv, process.env[envs[i]]);
    });
    return stringTemplate;
};

/**
 * Verify if a template is supported
 *
 * @param {String} templateType
 * @returns {Boolean}
 */
module.exports.isValidTemplateTypes = (templateType) => VALID_TEMPLATE_TYPES.includes(templateType);

/**
 * Parse template by applying all the parsing rules defined
 *
 * @param {Object} template
 *
 * @returns {String} parsed template
 */
module.exports.parse = (template) => {
    return parseTemplateEnvs(template);
};
