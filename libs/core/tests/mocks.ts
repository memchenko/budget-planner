import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'inversify';
import { Repo, RepoFilters } from 'core/shared/types';

// Generalized in-memory repository implementation
@injectable()
export class InMemoryRepo<T extends { id: string }> implements Repo<T> {
  constructor(private readonly store: Map<string, T> = new Map()) {}

  async create<P extends Omit<T, 'id'> & Partial<Pick<T, 'id'>>>(params: P): Promise<T | null> {
    const id = params.id || uuidv4();
    const entity = { ...params, id } as unknown as T;
    this.store.set(id, entity);
    return entity;
  }

  async removeOneBy(filters: RepoFilters<T>): Promise<boolean> {
    const item = await this.getOneBy(filters);
    if (item) {
      return this.store.delete(item.id);
    }
    return false;
  }

  async removeMany(filters: RepoFilters<T>): Promise<boolean> {
    const items = await this.getMany(filters);
    items.forEach((item) => this.store.delete(item.id));
    return true;
  }

  async getOneBy(filters: RepoFilters<T>): Promise<T | null> {
    const items = Array.from(this.store.values());
    return (
      items.find((item) => Object.entries(filters).every(([key, value]) => item[key as keyof T] === value)) || null
    );
  }

  async getMany(filters: RepoFilters<T>): Promise<T[]> {
    const items = Array.from(this.store.values());
    return items.filter((item) => Object.entries(filters).every(([key, value]) => item[key as keyof T] === value));
  }

  async getAll(): Promise<T[]> {
    return Array.from(this.store.values());
  }

  async updateOneBy(filters: RepoFilters<T>, values: Partial<Omit<T, 'id'>>): Promise<T | null> {
    const item = await this.getOneBy(filters);
    if (item) {
      const updated = { ...item, ...values };
      this.store.set(item.id, updated);
      return updated;
    }
    return null;
  }

  async updateMany(data: { filters: RepoFilters<T>; values: Partial<Omit<T, 'id'>> }[]): Promise<T[] | null> {
    const results: T[] = [];
    for (const { filters, values } of data) {
      const items = await this.getMany(filters);
      items.forEach((item) => {
        const updated = { ...item, ...values };
        this.store.set(item.id, updated);
        results.push(updated);
      });
    }
    return results.length > 0 ? results : null;
  }
}
