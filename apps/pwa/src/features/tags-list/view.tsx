import { Chip } from '@nextui-org/chip';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { TagsListController } from './controller';
import styles from './styles.module.css';
import { getTagColor } from './helpers';
import { useFormContext } from 'react-hook-form';
import { EntityType } from '../../entities/tag';

export interface TagsListProps {
  type: TagsListController['type'];
}

export const PROPERTY_NAME = 'selectedTags';

export const TagsList = observer((props: TagsListProps) => {
  const ctrl = useController(TagsListController);
  ctrl.type = props.type;
  const { setValue, getValues } = useFormContext<{
    [PROPERTY_NAME]: EntityType[];
  }>();
  ctrl.selectedTags = getValues(PROPERTY_NAME);

  const handleTagSelect = (tag: EntityType['id']) => {
    const tagEntity = ctrl.getTagById(tag);

    if (tagEntity) {
      setValue(PROPERTY_NAME, [...ctrl.selectedTags, tagEntity]);
    }
  };

  const handleTagUnselect = (tag: EntityType['id']) => {
    setValue(
      PROPERTY_NAME,
      ctrl.selectedTags.filter((selectedTag) => selectedTag.id !== tag),
    );
  };

  return (
    <div className={styles.tagsList}>
      {ctrl.mostPopularTags.length > 0 && (
        <>
          <span className={styles.label}>Recommended:</span>
          <ul className={styles.chipsList}>
            {ctrl.mostPopularTags.map((tag) => (
              <li key={tag.id}>
                <Chip
                  color={getTagColor(tag.title)}
                  size="lg"
                  variant="flat"
                  className="cursor-pointer"
                  onClick={() => handleTagSelect(tag.id)}
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
        label="Select tag"
        popoverProps={{
          updatePositionDeps: [ctrl.selectedTags.length],
        }}
        listboxProps={{
          emptyContent: ctrl.shouldDisplayCreateTagButton ? (
            <Button fullWidth color="primary" onClick={ctrl.handleCreateTagClick}>
              Create tag "{ctrl.searchQuery}"
            </Button>
          ) : (
            'No more tags exist'
          ),
        }}
        selectedKey={null}
        onInputChange={ctrl.handleSearchQueryChange}
        onSelectionChange={(key) => {
          return handleTagSelect(String(key));
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
          <span className={styles.label}>Selected tags:</span>
          <ul className={styles.chipsList}>
            {ctrl.selectedTags.map((tag) => (
              <li key={tag.id}>
                <Chip
                  isCloseable
                  color={getTagColor(tag.title)}
                  size="lg"
                  variant="flat"
                  className="cursor-pointer"
                  onClick={() => handleTagUnselect(tag.id)}
                  onClose={() => handleTagUnselect(tag.id)}
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
