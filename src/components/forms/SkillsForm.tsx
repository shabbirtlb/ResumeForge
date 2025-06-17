import React, { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import type { Skill } from '../../types';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange, onNext, onBack }) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as Skill['level'], category: 'Technical' as Skill['category'] });

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const skill: Skill = {
      name: newSkill.name.trim(),
      level: newSkill.level,
      category: newSkill.category
    };
    
    onChange([...data, skill]);
    setNewSkill({ name: '', level: 'Intermediate', category: 'Technical' });
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const skillsByCategory = {
    Technical: data.filter(skill => skill.category === 'Technical'),
    Soft: data.filter(skill => skill.category === 'Soft'),
    Language: data.filter(skill => skill.category === 'Language'),
    Tool: data.filter(skill => skill.category === 'Tool')
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Beginner': return 'bg-red-100 text-red-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills</h2>
          <p className="text-gray-600">Add your technical and soft skills</p>
        </div>

        {/* Add New Skill */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name *
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., JavaScript, Leadership, Spanish"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as Skill['category'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Technical">Technical</option>
                <option value="Soft">Soft Skills</option>
                <option value="Language">Language</option>
                <option value="Tool">Tool</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={addSkill}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Skills by Category */}
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {category} Skills ({skills.length})
              </h3>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => {
                    const globalIndex = data.findIndex(s => s === skill);
                    return (
                      <div
                        key={`${skill.name}-${index}`}
                        className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
                      >
                        <span className="font-medium text-gray-900 mr-2">{skill.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                        <button
                          onClick={() => removeSkill(globalIndex)}
                          className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No {category.toLowerCase()} skills added yet</p>
              )}
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No skills added yet. Add your first skill above!</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue to Templates
          </button>
        </div>
      </div>
    </div>
  );
};