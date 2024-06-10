export interface Repo<Entity extends {}, Id extends keyof Entity | never = never> {
  create(params: Omit<Entity, Id>): Promise<Entity | null>;

  removeOneBy(filters: RepoFilters<Entity>): Promise<boolean>;
  removeMany(filters: RepoFilters<Entity>): Promise<boolean>;

  getOneBy(filters: RepoFilters<Entity>): Promise<Entity | null>;
  getMany(filters: RepoFilters<Entity>): Promise<Entity[]>;
  getAll(): Promise<Entity[]>;

  updateOneBy(filters: RepoFilters<Entity>, values: Partial<Omit<Entity, Id>>): Promise<Entity | null>;
  updateMany(
    data: {
      filters: RepoFilters<Entity>;
      values: Partial<Omit<Entity, Id>>;
    }[],
  ): Promise<Entity[] | null>;
}

export type RepoFilters<Entity extends {}> = Partial<{
  [Key in keyof Entity]:
    | Entity[Key]
    | Entity[Key][]
    | {
        like?: string;
        range?: { from: Entity[Key]; to: Entity[Key] };
      };
}>;
