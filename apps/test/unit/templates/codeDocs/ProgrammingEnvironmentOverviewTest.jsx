import React from 'react';
import {shallow} from 'enzyme';
import {expect} from '../../../util/reconfiguredChai';
import ProgrammingEnvironmentOverview, {
  CategorySection
} from '@cdo/apps/templates/codeDocs/ProgrammingEnvironmentOverview';

describe('ProgrammingEnvironmentOverview', () => {
  let defaultProgrammingEnvironment;

  beforeEach(() => {
    defaultProgrammingEnvironment = {
      title: 'Sprite Lab',
      description: 'spritelab description',
      categories: [
        {
          key: 'world',
          name: 'World',
          color: '#acacd2',
          programmingExpressions: []
        },
        {
          key: 'sprites',
          name: 'Sprites',
          color: '#df9299',
          programmingExpressions: []
        }
      ]
    };
  });

  it('renders a category section for each category', () => {
    const wrapper = shallow(
      <ProgrammingEnvironmentOverview
        programmingEnvironment={defaultProgrammingEnvironment}
      />
    );
    expect(wrapper.find('CategorySection').length).to.equal(2);
    expect(
      wrapper.find('CategorySection').map(cat => cat.props().category.name)
    ).to.eql(['World', 'Sprites']);
  });

  it('renders description if provided', () => {
    const wrapper = shallow(
      <ProgrammingEnvironmentOverview
        programmingEnvironment={defaultProgrammingEnvironment}
      />
    );
    expect(wrapper.find('EnhancedSafeMarkdown').length).to.equal(1);
    expect(
      wrapper
        .find('EnhancedSafeMarkdown')
        .first()
        .props().markdown
    ).to.equal('spritelab description');
  });

  it('doesnt render description if not provided', () => {
    delete defaultProgrammingEnvironment.description;
    const wrapper = shallow(
      <ProgrammingEnvironmentOverview
        programmingEnvironment={defaultProgrammingEnvironment}
      />
    );
    expect(wrapper.find('EnhancedSafeMarkdown').length).to.equal(0);
  });
});

describe('CategorySection', () => {
  it('renders CategorySection', () => {
    const wrapper = shallow(
      <CategorySection
        category={{
          key: 'world',
          name: 'World',
          color: '#FFFFFF',
          programmingExpressions: [
            {
              key: 'location_picker'
            },
            {
              key: 'set_background'
            }
          ]
        }}
      />
    );
    expect(wrapper.text().includes('World')).to.be.true;
    expect(wrapper.find('CodeDocLink').length).to.equal(2);
  });
});
