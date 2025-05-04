import { Chip } from '@nextui-org/chip';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/hooks/useController';
import { TagsListController } from './controller';
import styles from './styles.module.css';
import { getTagColor } from './helpers';
import { EntityType } from '~/stores/tag';
import { useUnmount } from '~/shared/hooks/useUnmount';
import { t } from '~/shared/translations';

export interface TagsListProps {
  type: TagsListController['type'];
  parentType: EntityType['entities'][number]['entity'];
  parentId: EntityType['entities'][number]['entityId'];
  onChange(selectedTags: TagsListController['selectedTags'][number]['id'][]): void;
}

export const TagsList = observer((props: TagsListProps) => {
  const ctrl = useController(TagsListController);
  ctrl.type = props.type;
  ctrl.parentId = props.parentId;
  ctrl.parentType = props.parentType;
  ctrl.onChange = props.onChange;

  useUnmount(ctrl.reset);

  return (
    <div className={styles.tagsList}>
      {ctrl.recommendedTags.length > 0 && (
        <>
          <span className={styles.label}>{t('Recommended')}:</span>
          <ul className={styles.chipsList}>
            {ctrl.recommendedTags.map((tag) => (
              <li key={tag.id}>
                <Chip
                  color={getTagColor(tag.title)}
                  size="lg"
                  variant="flat"
                  className="cursor-pointer"
                  onClick={() => ctrl.handleTagSelect(tag.id)}
                >
                  {tag.title}
                </Chip>
              </li>
            ))}
          </ul>
          <Divider />
        </>
      )}

      <Autocomplete
        label={t('Select tag')}
        popoverProps={{
          updatePositionDeps: [ctrl.selectedTags.length],
        }}
        listboxProps={{
          emptyContent: t('No more tags exist'),
          bottomContent: ctrl.shouldDisplayCreateTagButton ? (
            <Button fullWidth color="primary" onPress={ctrl.handleCreateTagClick}>
              {t('Create tag')} "{ctrl.searchQuery}"
            </Button>
          ) : null,
        }}
        selectedKey={null}
        onInputChange={ctrl.handleSearchQueryChange}
        onSelectionChange={(key) => {
          return ctrl.handleTagSelect(String(key));
        }}
        onClick={(e) => {
          e.currentTarget.focus();
        }}
      >
        {ctrl.allTags.map((tag) => (
          <AutocompleteItem key={tag.id} value={tag.id}>
            {tag.title}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {ctrl.selectedTags.length > 0 && (
        <>
          <Divider />
          <span className={styles.label}>{t('Selected tags')}:</span>
          <ul className={styles.chipsList}>
            {ctrl.selectedTags.map((tag) => (
              <li key={tag.id}>
                <Chip
                  isCloseable
                  color={getTagColor(tag.title)}
                  size="lg"
                  variant="flat"
                  className="cursor-pointer"
                  onClick={() => ctrl.handleTagUnselect(tag.id)}
                  onClose={() => ctrl.handleTagUnselect(tag.id)}
                >
                  {tag.title}
                </Chip>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
});
