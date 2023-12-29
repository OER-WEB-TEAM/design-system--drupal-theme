// For more information about this wrapper, see
// https://www.drupal.org/docs/drupal-apis/javascript-api/javascript-api-overview
(function (Drupal) {

    // Organize your website scripting into Drupal Behaviors
    // @see: https://www.drupal.org/docs/drupal-apis/javascript-api/javascript-api-overview#s-example-using-drupalbehaviors

    // Dedicate one behavior per alike-functionalities.
    // A Drupal Behavior is an advanced API of the famous jQuery's $(document).ready() 
    // jQuery is deprecated !!STOP USING IT!!

    Drupal.behaviors.maincontent = {
        attach: function (context, setting) {

            // ---
            // Log the 'context', and 'setting' objects to see their properties
            // this will help you restrict the behavior where you need it.
            // ---

            // Example 1 - Run behavior only on pages that contain article element
            if (!context.querySelector("article")) return;

            // Example 2 - Run behavior only on node 1
            if (setting.path.currentPath !== "node/1") return;

            // --
            // Once you've got your restrictions set up, you need to make sure 
            // that your behavior runs only one time on a node/node-list
            // @see: https://www.npmjs.com/package/@drupal/once
            // --

            // Example 1 - Log "Hello World" for each article on the page
            once("behavior__greetings", "article", document.body).forEach(() => console.log("Hello World"));

            // ---
            // Note that this behavior actually works, if every condition above is met
            // ---
        }
    }
})(Drupal);