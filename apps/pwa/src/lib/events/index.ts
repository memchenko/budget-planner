import * as cost from '../../entities/cost';
import * as income from '../../entities/income';
import * as tag from '../../entities/tag';

export type CostFromCollaborator = {
  typeOfUpdate: 'new-cost';
  payload: cost.EntityType;
}

export type IncomeFromCollaborator = {
  typeOfUpdate: 'new-income';
  payload: income.EntityType;
}

export type TagFromCollaborator = {
  typeOfUpdate: 'new-tag';
  payload: tag.EntityType;
}
