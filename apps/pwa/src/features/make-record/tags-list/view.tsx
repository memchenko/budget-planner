import { Chip } from '@nextui-org/chip';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { observer } from 'mobx-react-lite';
import { useController } from '~/lib/hooks/useController';
import { TagsListController } from './controller';
import styles from './styles.module.css';
import { getTagColor } from './helpers';
import { EntityType } from '~/entities/tag';

export interface TagsListProps {
  type: TagsListController['type'];
  onChange(selectedTags: TagsListController['selectedTags']): void;
}

export const TagsList = observer((props: TagsListProps) => {
  const ctrl = useController(TagsListController);
  ctrl.type = props.type;

  const handleTagSelect = (tag: EntityType['id']) => {
    const tagEntity = ctrl.getTagById(tag);

    if (tagEntity) {
      ctrl.selectedTags = [...ctrl.selectedTags, tagEntity];
      props.onChange(ctrl.selectedTags);
    }
  };

  const handleTagUnselect = (tag: EntityType['id']) => {
    ctrl.selectedTags = ctrl.selectedTags.filter((selectedTag) => selectedTag.id !== tag);
    props.onChange(ctrl.selectedTags);
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
