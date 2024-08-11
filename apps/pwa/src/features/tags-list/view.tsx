import { Chip } from '@nextui-org/chip';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';

import { TagsListController } from './controller';

export interface TagsListProps {
  type: TagsListController['type'];
}

export const TagsList = observer((props: TagsListProps) => {
  const ctrl = useController(TagsListController);
  ctrl.type = props.type;

  return (
    <div>
      Recommended:{' '}
      {ctrl.getMostPopularTags().map((tag) => (
        <Chip key={tag.id}>{tag.title}</Chip>
      ))}
      <Autocomplete
        allowsEmptyCollection={ctrl.searchQuery.length > 0}
        label="Select tag"
        listboxProps={{
          emptyContent:
            ctrl.searchQuery.length > 0 ? (
              <Button onClick={ctrl.handleCreateTagClick}>Create tag "{ctrl.searchQuery}"</Button>
            ) : null,
        }}
        selectedKey={null}
        onInputChange={ctrl.handleSearchQueryChange}
        onSelectionChange={(key) => {
          return ctrl.handleTagSelect(String(key));
        }}
      >
        {ctrl.allTags.map((tag) => (
          <AutocompleteItem key={tag.id} value={tag.id}>
            {tag.title}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      Selected tags:{' '}
      {ctrl.selectedTags.map((tag) => (
        <Chip key={tag.id} onClick={() => ctrl.handleTagUnselect(tag.id)}>
          {tag.title}
        </Chip>
      ))}
    </div>
  );
});
