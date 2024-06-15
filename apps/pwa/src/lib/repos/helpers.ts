import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { RepoFilters } from '../../../../../libs/core';

export const getOneByRepoFilters = <Entity extends {}>(all: Entity[], filters: RepoFilters<Entity>) => {
  if (isEmpty(filters)) {
    return null;
  }

  return (
    all.find((entity) => {
      const entries = Object.entries(filters);

      return entries.every(([key, value]) => {
        return isEqual(entity[key as keyof Entity], value);
      });
    }) ?? null
  );
};

export const getManyByRepoFilters = <Entity extends {}>(all: Entity[], filters: RepoFilters<Entity>) => {
  if (isEmpty(filters)) {
    return null;
  }

  return all.filter((entity) => {
    const entries = Object.entries(filters);

    return entries.every(([key, value]) => {
      return isEqual(entity[key as keyof Entity], value);
    });
  });
};
