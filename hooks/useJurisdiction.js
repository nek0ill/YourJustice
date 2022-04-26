import Jurisdiction from 'classes/Jurisdiction';
import JurisdictionRule from 'classes/JurisdictionRule';
import useSubgraph from 'hooks/useSubgraph';
import { hexStringToJson } from 'utils/converters';

/**
 * Hook for work with jurisdiction.
 */
export default function useJurisdiction() {
  const { findJurisdictionEntities, findJurisdictionRuleEntities } =
    useSubgraph();

  /**
   * Get a jurisdiction.
   *
   * @param {string} id Jurisdiction id (address).
   * @returns {Promise.<Jurisdiction>} A jurisdiction or null.
   */
  let getJurisdiction = async function (id) {
    const jurisdictionEntities = await findJurisdictionEntities([id]);
    if (!jurisdictionEntities || jurisdictionEntities.length === 0) {
      return null;
    }
    const jurisdictionEntity = jurisdictionEntities[0];
    const jurisdiction = new Jurisdiction(
      jurisdictionEntity.id,
      jurisdictionEntity.roles,
      jurisdictionEntity.rules,
    );
    return jurisdiction;
  };

  /**
   * Get jurisdiction rules.
   *
   * @param {Array.<string>} ids A list with jurisdiction rule ids.
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {string} actionGuid Action id (guid).
   * @returns {Promise.<Array.<{JurisdictionRule}>>} Array with rule entities.
   */
  let getJusirsdictionRules = async function (ids, jurisdiction, actionGuid) {
    const jurisdictionRuleEntities = await findJurisdictionRuleEntities(
      ids,
      jurisdiction,
      actionGuid,
    );
    return jurisdictionRuleEntities.map(
      (ruleEntity) =>
        new JurisdictionRule(
          ruleEntity.id,
          ruleEntity.ruleId,
          ruleEntity.about.id,
          ruleEntity.affected,
          ruleEntity.negation,
          ruleEntity.uri,
          hexStringToJson(ruleEntity.uriData),
          ruleEntity.effectsEnvironmental,
          ruleEntity.effectsProfessional,
          ruleEntity.effectsSocial,
          ruleEntity.effectsPersonal,
          ruleEntity.confirmationRuling,
          ruleEntity.confirmationEvidence,
          ruleEntity.confirmationWitness,
        ),
    );
  };

  /**
   * Checking that the jurisdiction rule is in a category.
   *
   * @param {JurisdictionRule} rule Jurisdiction rule.
   * @param {'positive'|'negative'} category Category.
   * @returns {boolean} Result of checking.
   */
  let isJurisdictionRuleInCategory = function (rule, category) {
    if (category === 'positive') {
      return (
        rule?.rule?.effects?.environmental >= 0 &&
        rule?.rule?.effects?.professional >= 0 &&
        rule?.rule?.effects?.social >= 0 &&
        rule?.rule?.effects?.personal >= 0
      );
    } else if (category === 'negative') {
      return (
        rule?.rule?.effects?.environmental < 0 ||
        rule?.rule?.effects?.professional < 0 ||
        rule?.rule?.effects?.social < 0 ||
        rule?.rule?.effects?.personal < 0
      );
    } else {
      return false;
    }
  };

  return {
    getJurisdiction,
    getJusirsdictionRules,
    isJurisdictionRuleInCategory,
  };
}
