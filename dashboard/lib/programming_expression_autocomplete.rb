class ProgrammingExpressionAutocomplete < AutocompleteHelper
  def self.get_search_matches(query, limit, programming_environment_id)
    limit = format_limit(limit)

    rows = ProgrammingExpression.limit(limit)
    rows = rows.where(programming_environment_id: programming_environment_id) if programming_environment_id
    return [] if query.length < MIN_WORD_LENGTH
    query = format_query(query)
    rows = rows.
        where("MATCH(name,category) AGAINST(? in BOOLEAN MODE)", query)
    return rows.map(&:summarize_for_lesson_edit)
  end
end
