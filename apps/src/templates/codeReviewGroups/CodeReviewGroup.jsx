import React from 'react';
import PropTypes from 'prop-types';
import {Droppable} from 'react-beautiful-dnd';
import CodeReviewGroupMember from './CodeReviewGroupMember';

// A CodeReviewGroup is a component that
// CodeReviewGroupMembers can be dragged between as teachers are arranging students
// in their sections into groups.
// These are called "Droppables" in the package we're using (React Beautiful DnD).
// More information on React Beautiful DnD can be found here:
// https://github.com/atlassian/react-beautiful-dnd
export default function CodeReviewGroup({members, index}) {
  return (
    <Droppable key={index} droppableId={`${index}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
          {...provided.droppableProps}
        >
          {members.map((member, index) => (
            <CodeReviewGroupMember
              key={member.id}
              member={member}
              index={index}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

// TO DO: specify shape of members
CodeReviewGroup.propTypes = {
  members: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  margin: grid,
  width: 400,
  border: '1px solid'
});

export const grid = 8;
